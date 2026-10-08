<?php

namespace App\Services;

use App\Models\ContactMessage;
use PHPMailer\PHPMailer\PHPMailer;
use RuntimeException;

class ContactMailer
{
    public function send(ContactMessage $contact): void
    {
        $recipient = config('portfolio.contact_email');

        if (! is_string($recipient) || filter_var($recipient, FILTER_VALIDATE_EMAIL) === false) {
            throw new RuntimeException('Falta PORTFOLIO_CONTACT_EMAIL.');
        }

        $mail = app()->make(PHPMailer::class, ['exceptions' => true]);
        $mail->isSMTP();
        $mail->SMTPAuth = true;
        $mail->SMTPDebug = 0;
        $mail->Host = (string) config('mail.mailers.smtp.host');
        $mail->Port = (int) config('mail.mailers.smtp.port');
        $mail->Username = (string) config('mail.mailers.smtp.username');
        $mail->Password = (string) config('mail.mailers.smtp.password');
        $mail->SMTPSecure = match (strtolower((string) config('mail.mailers.smtp.encryption'))) {
            'tls' => PHPMailer::ENCRYPTION_STARTTLS,
            'ssl' => PHPMailer::ENCRYPTION_SMTPS,
            default => '',
        };
        $mail->CharSet = PHPMailer::CHARSET_UTF8;
        $mail->setFrom((string) config('mail.from.address'), (string) config('mail.from.name'));
        $mail->addAddress($recipient);
        $mail->addReplyTo($contact->email, $contact->name);
        $subject = trim((string) $contact->subject) ?: 'Nuevo mensaje desde portfolio';
        $mail->Subject = $subject;
        $mail->isHTML(true);
        $mail->Body = '<h1>Nuevo mensaje desde portfolio</h1>'
            .'<p><strong>Nombre:</strong> '.e($contact->name).'</p>'
            .'<p><strong>Email:</strong> '.e($contact->email).'</p>'
            .'<p><strong>Asunto:</strong> '.e($subject).'</p>'
            .'<p><strong>Mensaje:</strong><br>'.nl2br(e($contact->message)).'</p>';
        $mail->AltBody = "Nombre: {$contact->name}\nEmail: {$contact->email}\nAsunto: {$subject}\n\nMensaje:\n{$contact->message}";

        if (! $mail->send()) {
            throw new RuntimeException('No se pudo enviar la notificación de contacto.');
        }
    }
}
