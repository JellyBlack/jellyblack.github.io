---
title: 关于
date: 2021-10-10 18:36:51
---

# 当前站点信息

<p id='site_info'>正在加载，请稍候……</p>

站点已接入友盟+网站统计。如您有查看密码，可[点此](https://uweb.umeng.com/v1/login.php?siteid=1280180245)查看数据。

<p id="commit_info">正在加载上次提交信息……</p>

# 站点设置

*站点设置只在当前浏览环境有效。*

<p><input id="checkbox_hide_comments" class="checkbox" name="hide_comments" type="checkbox" /><label class="label" for="checkbox_hide_comments">隐藏Valine评论</label></p>
<p><input id="checkbox_hide_live2d" class="checkbox" name="hide_live2d" type="checkbox" /><label class="label" for="checkbox_hide_live2d">始终隐藏Live2D看板娘</label><button id="button_reload_live2d" class="button">重新加载</button></p>
<p><input id="checkbox_hide_welcome" class="checkbox" name="hide_welcome" type="checkbox" /><label class="label" for="checkbox_hide_welcome">在首页隐藏文章《欢迎来到Jelly的小窝~》</label></p>
<p><input id="checkbox_show_subtitle" class="checkbox" name="show_subtitle" type="checkbox" /><label class="label" for="checkbox_show_subtitle">显示主页轮播文字</label></p>
<p><input id="checkbox_show_btns" class="checkbox" name="show_btns" type="checkbox" /><label class="label" for="checkbox_show_btns">显示悬浮按钮</label></p>
<style>
.checkbox {
	width: 1.2em;
	height: 1.2em;
	margin-left: 0.4em;
	margin-right: 0.6em
}
.checkbox[name='hide_comments'] {
    margin-top: 0.3em
}
.label {
	position: relative;
	bottom: 0.2em
}
.button {
	position: relative;
	bottom: 0.2em;
	margin-left: 0.5em
}
</style>




# 关于站长

某不科學の技术宅，喜欢追番、玩游戏和研究技术，愿意为ACGN献身。（一看就是老二刺螈了）

QQ: 1574854804

Email: l45531@126.com jellyblack4553@gmail.com

哔哩哔哩：[JellyBlack](https://space.bilibili.com/368205203/)

Twitter: @JellyBlack4553

<script>
if(/^\/about/.test(window.location.pathname)){
	var info = '';
	var host = '';
	var hostname = window.location.hostname.toLowerCase();
	if(/github\.io$/.test(hostname)){
		host = 'github';
		info = "您访问的站点是GitHub站点。GitHub站点是主站点，用于开发与调试，国内加载较慢，请耐心等待。国内用户建议使用Gitee站点。";
	}
	else if(/gitee\.io$/.test(hostname)){
		host = 'gitee';
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
	$("#site_info").text(info);
	if(host == 'github' || host == 'gitee'){
		$.get(host == 'github' ? "https://api.github.com/repos/JellyBlack/jellyblack.github.io/commits/main" : "https://gitee.com/api/v5/repos/JellyBlack/jellyblack/commits/main", (data, status) => {
			if(status != 'success'){
				$("#commit_info").text("无法加载上次提交信息。");
			}
			else{
				try{
					var date = Date.parse(data.commit.committer.date);
					$("#commit_info").html("上次提交时间：" + formatDate(new Date(date)) + " <a id='commit_info_href' href='javascript:show_detail()'>查看详情</a>");
					show_detail = function(){
						$('#commit_info_href').hide();
						$('#commit_info').append('<br>提交者：<a href="mailto://' + data.commit.committer.email + '">' + data.committer.name + '</a><br>SHA：<a href="' + data.html_url + '">' + data.sha + '</a><br>#提交信息#<br>' + data.commit.message.replace(/\\n+/g, "<br>"));
					}
				}
				catch(e){
					console.log(e);
					$("#commit_info").text("无法加载上次提交信息。");
				}
			}
		});
	}
	else{
		$("#commit_info").text("非GitHub或Gitee站点，无法加载上次提交信息。");
	}
}
function formatDate(date) {
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var theDate = date.getDate();
	var hour = date.getHours();
	var minute = date.getMinutes();
	var second = date.getSeconds();
	if ( month < 10 ) {
		month = '0' + month;
	}
	if ( theDate < 10 ) {
		theDate = '0' + theDate;
	}
	if ( hour < 10 ) {
		hour = '0' + hour;
	}
	if ( minute < 10 ) {
		minute = '0' + minute;
	}
	if ( second < 10 ) {
		second = '0' + second;
	}
	return year +"-"+ month +"-" + theDate + " "+ hour +":"+ minute +":"+ second;
}
if(localStorage.hide_comments == 1){
	$("#checkbox_hide_comments").prop("checked", true);
}
if(localStorage.hide_live2d == 1){
	$("#checkbox_hide_live2d").prop("checked", true);
}
if(localStorage.hide_welcome == 1){
	$("#checkbox_hide_welcome").prop("checked", true);
}
if(localStorage.show_subtitle != 0){
	$("#checkbox_show_subtitle").prop("checked", true);
}
if(localStorage.show_btns != 0){
	$("#checkbox_show_btns").prop("checked", true);
}
$("#checkbox_hide_comments").click(function(){
	if($("#checkbox_hide_comments").is(":checked")){
		localStorage.hide_comments = 1;
		$("#vcomments-box").hide();
	}
	else{
		localStorage.hide_comments = 0;
		$("#vcomments-box").show();
	}
});
$("#checkbox_hide_live2d").click(function(){
	if($("#checkbox_hide_live2d").is(":checked")){
		localStorage.hide_live2d = 1;
		localStorage.setItem("waifu-display", Infinity);
        showMessage("愿你有一天能与重要的人重逢。", 2000, 11);
		document.getElementById("waifu").style.bottom = "-500px";
		setTimeout(() => {
			document.getElementById("waifu").style.visibility = "hidden";
		}, 3000);
	}
	else{
		localStorage.hide_live2d = 0;
		localStorage.setItem("waifu-display", 0);
        if(document.getElementById("waifu-tips")){
      		showMessage("果然舍不得我吧～哈哈哈", 6000, 11);
      		document.getElementById("waifu").style.visibility = "visible";
			document.getElementById("waifu").style.bottom = "0px";
        }
        else{
            initWidget({
				waifuPath: live2d_path + "waifu-tips.json",
				cdnPath: "https://cdn.jsdelivr.net/gh/fghrsh/live2d_api/"
			});
            showMessage("请舰长指示下一作战命令。", 6000, 11);
        }
	}
});
$("#button_reload_live2d").click(function(){
    localStorage.setItem("waifu-display", 0);
    localStorage.hide_live2d = 0;
	$("#checkbox_hide_live2d").prop("checked", false);
    if(document.getElementById("waifu-tips")){
        showMessage("果然舍不得我吧～哈哈哈", 6000, 11);
       	document.getElementById("waifu").style.visibility = "visible";
		document.getElementById("waifu").style.bottom = "0px";
    }
    else{
        initWidget({
			waifuPath: live2d_path + "waifu-tips.json",
			cdnPath: "https://cdn.jsdelivr.net/gh/fghrsh/live2d_api/"
		});
        showMessage("请舰长指示下一作战命令。", 6000, 11);
    }
});
$("#checkbox_hide_welcome").click(function(){
	if($("#checkbox_hide_welcome").is(":checked")){
        localStorage.setItem("hide_welcome", 1);
	}
	else{
		localStorage.setItem("hide_welcome", 0);
	}
});
$("#checkbox_show_subtitle").click(function(){
	if($("#checkbox_show_subtitle").is(":checked")){
        localStorage.setItem("show_subtitle", 1);
	}
	else{
		localStorage.setItem("show_subtitle", 0);
	}
});
$("#checkbox_show_btns").click(function(){
	if($("#checkbox_show_btns").is(":checked")){
        localStorage.setItem("show_btns", 1);
        $(".float_btns").show();
	}
	else{
		localStorage.setItem("show_btns", 0);
        $(".float_btns").hide();
	}
});
let messageTimer;
function showMessage(text, timeout, priority) {
	if (!text || (sessionStorage.getItem("waifu-text") && sessionStorage.getItem("waifu-text") > priority)) return;
	if (messageTimer) {
		clearTimeout(messageTimer);
		messageTimer = null;
	}
	text = randomSelection(text);
	sessionStorage.setItem("waifu-text", priority);
	const tips = document.getElementById("waifu-tips");
	tips.innerHTML = text;
	tips.classList.add("waifu-tips-active");
	messageTimer = setTimeout(() => {
		sessionStorage.removeItem("waifu-text");
		tips.classList.remove("waifu-tips-active");
	}, timeout);
}
function randomSelection(obj) {
	return Array.isArray(obj) ? obj[Math.floor(Math.random() * obj.length)] : obj;
}
</script>