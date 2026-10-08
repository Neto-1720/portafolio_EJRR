<?php

namespace App\Jobs;

use App\Models\ContactMessage;
use App\Services\ContactMailer;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class SendContactNotification implements ShouldQueue
{
    use Queueable;

    public int $tries = 3;

    public function __construct(public ContactMessage $contact) {}

    public function handle(ContactMailer $mailer): void
    {
        $mailer->send($this->contact);
    }
}
