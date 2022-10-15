@extends('layouts.admin')

@section('title')
    {{ $node->name }}: 配置
@endsection

@section('content-header')
    <h1>{{ $node->name }}<small>守护进程配置文件.</small></h1>
    <ol class="breadcrumb">
        <li><a href="{{ route('admin.index') }}">管理</a></li>
        <li><a href="{{ route('admin.nodes') }}">节点</a></li>
        <li><a href="{{ route('admin.nodes.view', $node->id) }}">{{ $node->name }}</a></li>
        <li class="active">配置</li>
    </ol>
@endsection

@section('content')
<div class="row">
    <div class="col-xs-12">
        <div class="nav-tabs-custom nav-tabs-floating">
            <ul class="nav nav-tabs">
                <li><a href="{{ route('admin.nodes.view', $node->id) }}">关于</a></li>
                <li><a href="{{ route('admin.nodes.view.settings', $node->id) }}">设置</a></li>
                <li class="active"><a href="{{ route('admin.nodes.view.configuration', $node->id) }}">配置</a></li>
                <li><a href="{{ route('admin.nodes.view.allocation', $node->id) }}">分配</a></li>
                <li><a href="{{ route('admin.nodes.view.servers', $node->id) }}">服务器</a></li>
            </ul>
        </div>
    </div>
</div>
<div class="row">
    <div class="col-sm-8">
        <div class="box box-primary">
            <div class="box-header with-border">
                <h3 class="box-title">配置文件</h3>
            </div>
            <div class="box-body">
                <pre class="no-margin">{{ $node->getYamlConfiguration() }}</pre>
            </div>
            <div class="box-footer">
                <p class="no-margin">这个文件应该放在你的守护进程的根目录中 (一般是 <code>/etc/pterodactyl</code>) 中的 <code>config.yml</code>.</p>
            </div>
        </div>
    </div>
    <div class="col-sm-4">
        <div class="box box-success">
            <div class="box-header with-border">
                <h3 class="box-title">自动部署</h3>
            </div>
            <div class="box-body">
                <p class="text-muted small">
                    使用下方按钮生成自定义部署命令，可用于自动配置 Wings 守护进程。
                </p>
            </div>
            <div class="box-footer">
                <button type="button" id="configTokenBtn" class="btn btn-sm btn-default" style="width:100%;">生成自动部署指令</button>
            </div>
        </div>
    </div>
</div>
@endsection

@section('footer-scripts')
    @parent
    <script>
    $('#configTokenBtn').on('click', function (event) {
        $.ajax({
            method: 'POST',
            url: '{{ route('admin.nodes.view.configuration.token', $node->id) }}',
            headers: { 'X-CSRF-TOKEN': '{{ csrf_token() }}' },
        }).done(function (data) {
            swal({
                type: 'success',
                title: '指令已生成.',
                text: '<p>要自动配置节点，请运行以下命令:<br /><small><pre>cd /etc/pterodactyl && sudo wings configure --panel-url {{ config('app.url') }} --token ' + data.token + ' --node ' + data.node + '{{ config('app.debug') ? ' --allow-insecure' : '' }}</pre></small></p>',
                html: true
            })
        }).fail(function () {
            swal({
                title: '错误',
                text: '生成自动部署指令时发生错误，无法继续此操作.',
                type: 'error'
            });
        });
    });
    </script>
@endsection
