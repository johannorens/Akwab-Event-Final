<?php

namespace Tests;

use App\Models\Role;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        Role::firstOrCreate(
            ['id_role' => 1],
            ['libelle' => 'admin']
        );
        Role::firstOrCreate(
            ['id_role' => 2],
            ['libelle' => 'utilisateur']
        );
    }
}
// test
