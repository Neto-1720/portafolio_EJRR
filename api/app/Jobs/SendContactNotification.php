<?php

namespace App\Jobs;

use App\Mail\ContactNotificationMail;
use App\Models\ContactMessage;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Mail;
use RuntimeException;

class SendContactNotification implements ShouldQueue
{
    use Queueable;

    public int $tries = 3;

    public function __construct(public ContactMessage $contact) {}

    public function handle(): void
    {
        $recipient = config('portfolio.contact_email');

        if (! is_string($recipient) || filter_var($recipient, FILTER_VALIDATE_EMAIL) === false) {
            throw new RuntimeException('Falta PORTFOLIO_CONTACT_EMAIL.');
        }

        Mail::to($recipient)->send(new ContactNotificationMail($this->contact));
    }
}
