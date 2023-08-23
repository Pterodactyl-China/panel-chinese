<?php

namespace Pterodactyl\Console\Commands\Maintenance;

use Carbon\CarbonImmutable;
use Illuminate\Console\Command;
use Pterodactyl\Repositories\Eloquent\BackupRepository;

class PruneOrphanedBackupsCommand extends Command
{
    protected $signature = 'p:maintenance:prune-backups {--prune-age=}';

    protected $description = '将所有过去 "n" 分钟内未完成备份的标记为失败。';

    /**
     * PruneOrphanedBackupsCommand constructor.
     */
    public function __construct(private BackupRepository $backupRepository)
    {
        parent::__construct();
    }

    public function handle()
    {
        $since = $this->option('prune-age') ?? config('backups.prune_age', 360);
        if (!$since || !is_digit($since)) {
            throw new \InvalidArgumentException('"--prune-age" 参数的值必须大于 0。');
        }

        $query = $this->backupRepository->getBuilder()
            ->whereNull('completed_at')
            ->where('created_at', '<=', CarbonImmutable::now()->subMinutes($since)->toDateTimeString());

        $count = $query->count();
        if (!$count) {
            $this->info('没有被标记为失败的无主备份。');

            return;
        }

        $this->warn("将过去 $since 分钟内未完成的 $count 个备份标记为失败。");

        $query->update([
            'is_successful' => false,
            'completed_at' => CarbonImmutable::now(),
            'updated_at' => CarbonImmutable::now(),
        ]);
    }
}
