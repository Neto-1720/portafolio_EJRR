<?php

namespace App\Models;

use Database\Factories\DemoConversationFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'customer_name',
    'customer_identifier',
    'status',
    'assigned_to',
    'last_message_at',
])]
class DemoConversation extends Model
{
    /** @use HasFactory<DemoConversationFactory> */
    use HasFactory;

    public const STATUS_OPEN = 'open';

    public const STATUS_PENDING = 'pending';

    public const STATUS_CLOSED = 'closed';

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'last_message_at' => 'datetime',
        ];
    }

    /**
     * @return HasMany<DemoMessage, $this>
     */
    public function messages(): HasMany
    {
        return $this->hasMany(DemoMessage::class, 'conversation_id')->orderBy('sent_at')->orderBy('id');
    }
}
