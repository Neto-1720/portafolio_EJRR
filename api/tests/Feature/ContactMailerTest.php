<?php

namespace Tests\Feature;

use App\Models\ContactMessage;
use App\Services\ContactMailer;
use Mockery;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\PHPMailer;
use RuntimeException;
use Tests\TestCase;

class ContactMailerTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        config([
            'mail.mailers.smtp.host' => 'smtp.example.test',
            'mail.mailers.smtp.port' => 587,
            'mail.mailers.smtp.username' => 'smtp-user',
            'mail.mailers.smtp.password' => 'test-password',
            'mail.mailers.smtp.encryption' => 'tls',
            'mail.from.address' => 'portfolio@example.test',
            'mail.from.name' => 'Portfolio',
            'portfolio.contact_email' => 'owner@example.test',
        ]);
    }

    public function test_smtp_message_uses_configuration_and_escapes_html(): void
    {
        $mail = Mockery::mock(PHPMailer::class)->makePartial();
        $mail->shouldReceive('send')->once()->andReturnUsing(function () use ($mail): bool {
            $this->assertSame('smtp', $mail->Mailer);
            $this->assertTrue($mail->SMTPAuth);
            $this->assertSame(0, $mail->SMTPDebug);
            $this->assertSame('smtp.example.test', $mail->Host);
            $this->assertSame(587, $mail->Port);
            $this->assertSame('smtp-user', $mail->Username);
            $this->assertSame('test-password', $mail->Password);
            $this->assertSame(PHPMailer::ENCRYPTION_STARTTLS, $mail->SMTPSecure);
            $this->assertSame('utf-8', $mail->CharSet);
            $this->assertSame('portfolio@example.test', $mail->From);
            $this->assertSame('Portfolio', $mail->FromName);
            $this->assertSame([['owner@example.test', '']], $mail->getToAddresses());
            $this->assertSame([['ana@example.test', 'Ana Pérez']], $mail->getReplyToAddresses());
            $this->assertSame('Proyecto & colaboración', $mail->Subject);
            $this->assertSame('text/html', $mail->ContentType);
            $this->assertStringContainsString('Ana Pérez', $mail->Body);
            $this->assertStringContainsString('ana@example.test', $mail->Body);
            $this->assertStringContainsString('Proyecto &amp; colaboración', $mail->Body);
            $this->assertStringContainsString('&lt;script&gt;alert(1)&lt;/script&gt;<br />', $mail->Body);
            $this->assertStringNotContainsString('<script>', $mail->Body);
            $this->assertSame("Nombre: Ana Pérez\nEmail: ana@example.test\nAsunto: Proyecto & colaboración\n\nMensaje:\n<script>alert(1)</script>\nSegunda línea", $mail->AltBody);

            return true;
        });
        $this->app->bind(PHPMailer::class, fn () => $mail);

        (new ContactMailer)->send($this->contact());
    }

    public function test_missing_subject_uses_default_and_ssl_is_supported(): void
    {
        config(['mail.mailers.smtp.encryption' => 'ssl']);
        $mail = Mockery::mock(PHPMailer::class)->makePartial();
        $mail->shouldReceive('send')->once()->andReturnUsing(function () use ($mail): bool {
            $this->assertSame('Nuevo mensaje desde portfolio', $mail->Subject);
            $this->assertSame(PHPMailer::ENCRYPTION_SMTPS, $mail->SMTPSecure);

            return true;
        });
        $this->app->bind(PHPMailer::class, fn () => $mail);
        $contact = $this->contact();
        $contact->subject = null;

        (new ContactMailer)->send($contact);
    }

    public function test_phpmailer_exception_is_propagated(): void
    {
        $mail = Mockery::mock(PHPMailer::class)->makePartial();
        $mail->shouldReceive('send')->once()->andThrow(new Exception('SMTP unavailable'));
        $this->app->bind(PHPMailer::class, fn () => $mail);
        $this->expectException(Exception::class);
        $this->expectExceptionMessage('SMTP unavailable');

        (new ContactMailer)->send($this->contact());
    }

    public function test_false_send_result_also_throws(): void
    {
        $mail = Mockery::mock(PHPMailer::class)->makePartial();
        $mail->shouldReceive('send')->once()->andReturn(false);
        $this->app->bind(PHPMailer::class, fn () => $mail);
        $this->expectException(RuntimeException::class);

        (new ContactMailer)->send($this->contact());
    }

    public function test_missing_recipient_fails_before_smtp(): void
    {
        config(['portfolio.contact_email' => null]);
        $mail = Mockery::mock(PHPMailer::class);
        $mail->shouldNotReceive('send');
        $this->app->bind(PHPMailer::class, fn () => $mail);
        $this->expectException(RuntimeException::class);
        $this->expectExceptionMessage('Falta PORTFOLIO_CONTACT_EMAIL.');

        (new ContactMailer)->send($this->contact());
    }

    private function contact(): ContactMessage
    {
        return new ContactMessage([
            'name' => 'Ana Pérez',
            'email' => 'ana@example.test',
            'subject' => 'Proyecto & colaboración',
            'message' => "<script>alert(1)</script>\nSegunda línea",
        ]);
    }
}
