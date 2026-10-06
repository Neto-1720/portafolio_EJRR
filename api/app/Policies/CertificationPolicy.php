<?php

namespace App\Policies;

use App\Models\Certification;
use App\Models\User;

class CertificationPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->exists;
    }

    public function view(User $user, Certification $certification): bool
    {
        return $user->exists;
    }

    public function create(User $user): bool
    {
        return $user->exists;
    }

    public function update(User $user, Certification $certification): bool
    {
        return $user->exists;
    }

    public function delete(User $user, Certification $certification): bool
    {
        return $user->exists;
    }
}
