<?php

namespace App\Policies;

use App\Models\Project;
use App\Models\User;

class ProjectPolicy
{
    public function viewAny(User $user): bool
    {
        return $this->allowed($user);
    }

    public function view(User $user, Project $project): bool
    {
        return $this->allowed($user);
    }

    public function create(User $user): bool
    {
        return $this->allowed($user);
    }

    public function update(User $user, Project $project): bool
    {
        return $this->allowed($user);
    }

    public function delete(User $user, Project $project): bool
    {
        return $this->allowed($user);
    }

    private function allowed(User $user): bool
    {
        return $user->exists;
    }
}
