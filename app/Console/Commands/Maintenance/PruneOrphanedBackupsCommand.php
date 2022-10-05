<?php

namespace Pterodactyl\Console\Commands\Maintenance;

use Carbon\CarbonImmutable;
use InvalidArgumentException;
use Illuminate\Console\Command;
use Pterodactyl\Repositories\Eloquent\BackupRepository;

class PruneOrphanedBackupsCommand extends Command
{
    /**
     * @var string
     */
    protected $signature = 'p:maintenance:prune-backups {--prune-age=}';

    /**
     * @var string
     */
    protected $description = '将所有在过去"n"分钟内未完成的备份标记为失败。';

    public function handle(BackupRepository $repository)
    {
        $since = $this->option('prune-age') ?? config('backups.prune_age', 360);
        if (!$since || !is_digit($since)) {
            throw new InvalidArgumentException('"--prune-age" 参数的值必须大于 0。');
        }

        $query = $repository->getBuilder()
            ->whereNull('completed_at')
            ->where('created_at', '<=', CarbonImmutable::now()->subMinutes($since)->toDateTimeString());

        $count = $query->count();
        if (!$count) {
            $this->info('没有被标记为失败的无主备份。');

            return;
        }

        $this->warn("将在过去 {$since} 分钟内未标记为已完成的 {$count} 个备份标记为失败。");

        $query->update([
            'is_successful' => false,
            'completed_at' => CarbonImmutable::now(),
            'updated_at' => CarbonImmutable::now(),
        ]);
    }
}
