<?php

namespace Pterodactyl\Console\Commands\Overrides;

use Illuminate\Foundation\Console\KeyGenerateCommand as BaseKeyGenerateCommand;

class KeyGenerateCommand extends BaseKeyGenerateCommand
{
    /**
     * Override the default Laravel key generation command to throw a warning to the user
     * if it appears that they have already generated an application encryption key.
     */
    public function handle()
    {
        if (!empty(config('app.key')) && $this->input->isInteractive()) {
            $this->output->warning('您似乎已经配置了应用程序加密密钥。如果继续此过程将会覆盖该密钥并导致任何现有已加密数据的损坏。除非您知道自己在做什么，否则请勿继续。');
            if (!$this->confirm('我了解执行此命令的后果，并承担对加密数据丢失的所有责任。')) {
                return;
            }

            if (!$this->confirm('您确定要继续吗？更改应用程序加密密钥将将导致数据丢失。')) {
                return;
            }
        }

        parent::handle();
    }
}
