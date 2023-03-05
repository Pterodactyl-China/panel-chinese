<?php

namespace Pterodactyl\Console;

/**
 * @mixin \Illuminate\Console\Command
 */
trait RequiresDatabaseMigrations
{
    /**
     * Checks if the migrations have finished running by comparing the last migration file.
     */
    protected function hasCompletedMigrations(): bool
    {
        /** @var \Illuminate\Database\Migrations\Migrator $migrator */
        $migrator = $this->getLaravel()->make('migrator');

        $files = $migrator->getMigrationFiles(database_path('migrations'));

        if (!$migrator->repositoryExists()) {
            return false;
        }

        if (array_diff(array_keys($files), $migrator->getRepository()->getRan())) {
            return false;
        }

        return true;
    }

    /**
     * Throw a massive error into the console to hopefully catch the users attention and get
     * them to properly run the migrations rather than ignoring all of the other previous
     * errors...
     */
    protected function showMigrationWarning(): void
    {
        $this->getOutput()->writeln('<options=bold>
| @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ |
|                                                                              |
|                             您的数据库未正确迁移！                             |
|                                                                              |
| @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ |</>

您必须运行以下命令才能完成数据库迁移：

  <fg=green;options=bold>php artisan migrate --step --force</>

如果您不运行上述命令进行修复数据库你将无法正常使用 Pterodactyl 面板。
');

        $this->getOutput()->error('在继续之前，您必须更正上述错误。');
    }
}
