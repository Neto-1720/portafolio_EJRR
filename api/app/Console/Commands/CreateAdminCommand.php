<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Validator;

class CreateAdminCommand extends Command
{
    protected $signature = 'portfolio:create-admin';

    protected $description = 'Crea el usuario administrador del portafolio';

    public function handle(): int
    {
        $name = trim((string) $this->ask('Name'));
        $email = trim((string) $this->ask('Email'));
        $password = (string) $this->secret('Password');
        $confirmation = (string) $this->secret('Confirm password');

        $validator = Validator::make(
            [
                'name' => $name,
                'email' => $email,
                'password' => $password,
            ],
            [
                'name' => ['required', 'string', 'max:120'],
                'email' => ['required', 'email', 'max:180', 'unique:users,email'],
                'password' => ['required', 'string', 'min:8'],
            ],
        );

        if ($password !== $confirmation) {
            $this->error('Las contraseñas no coinciden.');

            return self::FAILURE;
        }

        if ($validator->fails()) {
            foreach ($validator->errors()->all() as $message) {
                $this->error($message);
            }

            return self::FAILURE;
        }

        User::query()->create([
            'name' => $name,
            'email' => $email,
            'password' => $password,
        ]);

        $this->info('Administrador creado.');

        return self::SUCCESS;
    }
}
