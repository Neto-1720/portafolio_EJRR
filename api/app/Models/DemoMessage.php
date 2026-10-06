<?php

namespace App\Models;

use Database\Factories\DemoMessageFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['conversation_id', 'sender_type', 'content', 'sent_at'])]
class DemoMessage extends Model
{
    /** @use HasFactory<DemoMessageFactory> */
    use HasFactory;

    public const SENDER_CUSTOMER = 'customer';

    public const SENDER_AGENT = 'agent';

    public const SENDER_BOT = 'bot';

    public const SENDER_SYSTEM = 'system';

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'sent_at' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<DemoConversation, $this>
     */
    public function conversation(): BelongsTo
    {
        return $this->belongsTo(DemoConversation::class, 'conversation_id');
    }
}
