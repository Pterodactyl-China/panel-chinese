<?php

namespace Pterodactyl\Http\Requests\Admin\Settings;

use Illuminate\Validation\Rule;
use Pterodactyl\Traits\Helpers\AvailableLanguages;
use Pterodactyl\Http\Requests\Admin\AdminFormRequest;

class BaseSettingsFormRequest extends AdminFormRequest
{
    use AvailableLanguages;

    public function rules(): array
    {
        return [
            'app:name' => 'required|string|max:191',
            'pterodactyl:auth:2fa_required' => 'required|integer|in:0,1,2',
            'app:locale' => ['required', 'string', Rule::in(array_keys($this->getAvailableLanguages()))],
            'logo:title' => 'nullable|string',
            'logo:favicon' => 'nullable|string',
            'logo:auth' => 'nullable|string',
        ];
    }

    public function attributes(): array
    {
        return [
            'app:name' => '公司名称',
            'pterodactyl:auth:2fa_required' => '要求动态口令认证登录',
            'app:locale' => '默认语言',
            'logo:title' => '',
            'logo:favicon' => '/favicons/favicon.ico',
            'logo:auth' => '',
        ];
    }
}
