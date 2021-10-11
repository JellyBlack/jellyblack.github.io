// 在“关于”页面添加当前站点信息
hexo.extend.injector.register('body_end', `<script>
	if(/^\\/about/.test(window.location.pathname)){
		var info = '';
		var hostname = window.location.hostname.toLowerCase();
		if(hostname == 'github'){
			info = "您访问的站点是GitHub站点。GitHub站点是主站点，用于开发与调试，国内加载较慢，请耐心等待。国内用户建议使用Gitee站点。";
		}
		else if(hostname == 'gitee'){
			info = "您访问的站点是Gitee站点。Gitee站点用于加快国内访问速度，国内用户建议使用。Gitee站点使用GitHub Actions与GitHub站点保持同步。若发现二者不同步，请叫站长重新发布一下Gitee Pages(^_−)☆";
		}
		else if(hostname == 'localhost' || hostname == '127.0.0.1'){
			info = "您访问的站点是本机站点。真的猛士，敢于直面惨淡的Warning，敢于正视淋漓的Error。祝代码运行顺利~";
		}
		else if(/^192\.168\./.test(hostname)){
			info = "您访问的站点是局域网站点。真的猛士，敢于直面惨淡的Warning，敢于正视淋漓的Error。祝代码运行顺利~";
		}
		else{
			info = "无法读取您访问的站点信息。";
		}
		$("h1#当前站点信息+p").text(info);
	}
</script>`, 'page');