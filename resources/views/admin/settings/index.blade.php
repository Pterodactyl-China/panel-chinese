@extends('layouts.admin')
@include('partials/admin.settings.nav', ['activeTab' => 'basic'])

@section('title')
    设置
@endsection

@section('content-header')
    <h1>面板设置<small>配置面板.</small></h1>
    <ol class="breadcrumb">
        <li><a href="{{ route('admin.index') }}">管理</a></li>
        <li class="active">设置</li>
    </ol>
@endsection

@section('content')
    @yield('settings::nav')
    <div class="row">
        <div class="col-xs-12">
            <div class="box">
                <div class="box-header with-border">
                    <h3 class="box-title">面板设置</h3>
                </div>
                <form action="{{ route('admin.settings') }}" method="POST">
                    <div class="box-body">
                        <div class="row">
                            <div class="form-group col-md-4">
                                <label class="control-label">公司名称</label>
                                <div>
                                    <input type="text" class="form-control" name="app:name" value="{{ old('app:name', config('app.name')) }}" />
                                    <p class="text-muted"><small>这是整个面板和发送给用户的电子邮箱中使用的名称.</small></p>
                                </div>
                            </div>
                            <div class="form-group col-md-4">
                                <label class="control-label">要求动态口令认证登录</label>
                                <div>
                                    <div class="btn-group" data-toggle="buttons">
                                        @php
                                            $level = old('pterodactyl:auth:2fa_required', config('pterodactyl.auth.2fa_required'));
                                        @endphp
                                        <label class="btn btn-primary @if ($level == 0) active @endif">
                                            <input type="radio" name="pterodactyl:auth:2fa_required" autocomplete="off" value="0" @if ($level == 0) checked @endif> 不要求
                                        </label>
                                        <label class="btn btn-primary @if ($level == 1) active @endif">
                                            <input type="radio" name="pterodactyl:auth:2fa_required" autocomplete="off" value="1" @if ($level == 1) checked @endif> 仅限管理员
                                        </label>
                                        <label class="btn btn-primary @if ($level == 2) active @endif">
                                            <input type="radio" name="pterodactyl:auth:2fa_required" autocomplete="off" value="2" @if ($level == 2) checked @endif> 所有用户
                                        </label>
                                    </div>
                                    <p class="text-muted"><small>如果启用，任何属于所选分组的帐户都需要启用动态口令认证才能使用面板.</small></p>
                                </div>
                            </div>
                            <div class="form-group col-md-4">
                                <label class="control-label">默认语言</label>
                                <div>
                                    <select name="app:locale" class="form-control">
                                        @foreach($languages as $key => $value)
                                            <option value="{{ $key }}" @if(config('app.locale') === $key) selected @endif>{{ $value }}</option>
                                        @endforeach
                                    </select>
                                    <p class="text-muted"><small>此功能需要面板的首位用户设置为相应的语言，返回这里并再按一次保存，即可同步</small></p>
                                </div>
                            </div>
                            <div class="form-group col-md-4">
                                <label class="control-label">标题LOGO</label>
                                <div>
                                    <input type="text" class="form-control" name="logo:title" value="{{ old('logo:title', config('logo.title')) }}" />
                                    <p class="text-muted"><small>这是在首页左上角文字的LOGO，如果不填则默认为"公司名称".</small></p>
                                </div>
                            </div>
                            <div class="form-group col-md-4">
                                <label class="control-label">网站LOGO</label>
                                <div>
                                    <input type="text" class="form-control" name="logo:favicon" value="{{ old('logo:favicon', config('logo.favicon')) }}" />
                                    <p class="text-muted"><small>这是站点的 favicon 图标，不填则为默认LOGO.</small></p>
                                </div>
                            </div>
                            <div class="form-group col-md-4">
                                <label class="control-label">登录页LOGO</label>
                                <div>
                                    <input type="text" class="form-control" name="logo:auth" value="{{ old('logo:auth', config('logo.auth')) }}" />
                                    <p class="text-muted"><small>这是面板登录页展示的LOGO，不填则为默认LOGO.(此功能并未完善)</small></p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="box-footer">
                        {!! csrf_field() !!}
                        <button type="submit" name="_method" value="PATCH" class="btn btn-sm btn-primary pull-right">保存</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
@endsection
