<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

#[Fillable(['name', 'slug', 'category', 'sort_order'])]
class Technology extends Model
{
    public const CATEGORY_BACKEND = 'backend';

    public const CATEGORY_FRONTEND = 'frontend';

    public const CATEGORY_DATABASE = 'database';

    public const CATEGORY_INTEGRATION = 'integration';

    public const CATEGORY_QUALITY = 'quality';

    public const CATEGORY_TOOLING = 'tooling';

    public const CATEGORY_OTHER = 'other';

    /**
     * @return BelongsToMany<Project, $this>
     */
    public function projects(): BelongsToMany
    {
        return $this->belongsToMany(Project::class);
    }
}
