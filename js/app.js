var url_act='http://carrotstore.com/app_mobile/shortenlinks/app_chorme_extesion.php';
var lang='en';

var area_login=null;
var area_list_link=null;
var body_main=null;
var area_footer=null;
var id_device='';
var btn_lang=null;
var img_avatar=null;

$(function () {
    chrome.storage.local.get('lang_app', function (result) {
        if(result.lang_app!=''){
            lang=result.lang_app['lang'];
        };
    });

    body_main=document.querySelectorAll("#body_main");
    body_main=body_main[0];
    area_login=document.querySelectorAll("#login");
    area_login=area_login[0];
    area_list_link=document.querySelectorAll("#list_link");
    area_list_link=area_list_link[0];
    area_footer=document.querySelectorAll("#footer");
    area_footer=area_footer[0];
    btn_lang=document.querySelectorAll("#img_lang");
    btn_lang=btn_lang[0];
    btn_lang.addEventListener('click',function () {
        show_select_lang();
    });
    show_main();
    load_img_lang();
});

function show_main(){
    var label_link=document.createElement("label");
    label_link.innerHTML="After shortening the link, you will have a new link that is shorter and easier to remember. Easy to share and send";
    label_link.classList.add('label');
    label_link.classList.add('lang');
    label_link.setAttribute("val","app_title_tip");
    var error_link=document.createElement("strong");
    error_link.innerHTML="The link is malformed";
    error_link.classList.add("lang");
    error_link.classList.add('error');
    error_link.setAttribute("val","link_error");
    var inp_link=document.createElement("input");
    inp_link.setAttribute("id","inp_link");
    inp_link.setAttribute("type","text");
    inp_link.setAttribute("placeholder","Enter link here...");
    inp_link.classList.add("inp");
    inp_link.classList.add("pl");
    var btn_create_link=document.createElement("button");
    btn_create_link.innerHTML="Create shortened links";
    btn_create_link.classList.add("buttonPro");
    btn_create_link.classList.add("green");
    btn_create_link.classList.add("large");
    btn_create_link.classList.add("lang");
    btn_create_link.setAttribute("val","create_link_shortened");
    btn_create_link.addEventListener('click',function () {
        var inp_link=$("#inp_link").val();
        $("#loading").fadeIn(200);
        if(isValidURL(inp_link)) {
            if (id_device == "") {
                $.ajax({
                    url: url_act,
                    jsonp: "create_link",
                    type: "post",
                    data: "function=create_link&id_device="+id_device+"&link="+encodeURI(inp_link)+"&lang="+lang,
                    success: function(data_link, textStatus, jqXHR)
                    {
                        var link_obj=JSON.parse(data_link);
                        show_link_done(link_obj.qr,link_obj.link_detail);
                        $("#loading").fadeOut(200);
                        chrome.storage.local.get({list_link: []}, function (result) {
                            var data_lik = result.list_link;
                            data_lik.push({'link': inp_link, HasBeenUploadedYet: false});
                            chrome.storage.local.set({list_link: data_lik}, function () {});
                        });
                    }
                });
            } else {
                $.ajax({
                    url: url_act,
                    jsonp: "create_link",
                    type: "post",
                    data: "function=create_link&id_device="+id_device+"&link="+encodeURI(inp_link)+"&lang="+lang,
                    success: function(data_link, textStatus, jqXHR)
                    {
                        var link_obj=JSON.parse(data_link);
                        show_link_done(link_obj.qr,link_obj.link_detail);
                        $("#loading").fadeOut(200);
                    }
                });
            }
        }else{
            error_link.style.display="block";
            $("#loading").fadeOut(200)
        }
    });
    body_main.innerHTML="";
    body_main.appendChild(label_link);
    body_main.appendChild(error_link);
    body_main.appendChild(inp_link);
    body_main.appendChild(btn_create_link);
    check_and_show_login();
    show_footer();
    show_lang();
}


function delete_link(i){
    var index_delete=parseInt(i);
    chrome.storage.local.get('list_link', function (result) {
        var data_l=result.list_link;
        data_l.splice(index_delete,1);
        chrome.storage.local.set({list_link: data_l}, function () {
            show_list_link();
        });
    });
}


function  show_list_link() {
    chrome.storage.local.get('list_link', function (result) {
        var data_l=result.list_link;
        area_list_link.innerHTML="";
        for(var i=0;i<data_l.length;i++){
            var btn_delete=document.createElement("button");
            btn_delete.innerHTML='<i class="fa fa-trash-o"></i>';
            btn_delete.classList.add("buttonPro");
            btn_delete.classList.add("red");
            btn_delete.classList.add("small");
            btn_delete.classList.add("btn_delete");
            btn_delete.setAttribute("id_link",i);
            btn_delete.addEventListener('click',function () {
                delete_link(this.getAttribute("id_link"));
            });
            var item_link = document.createElement("div");   // Create a <button> element
            item_link.innerHTML = data_l[i].link;
            item_link.classList.add("item");
            item_link.appendChild(btn_delete);
            area_list_link.appendChild(item_link);
        }
    });
}

function  show_list_link_by_account() {
    area_list_link.innerHTML="<img src='images/waiting.gif'/>";
    $.ajax({
        url: url_act,
        jsonp: "show_list_link_by_account",
        type: "post",
        data: "function=show_list_link_by_account&lang="+lang+"&id_device="+id_device,
        success: function(data, textStatus, jqXHR)
        {
            area_list_link.innerHTML="";
            var list_link=JSON.parse(data);
            for (var i=0;i<list_link.length;i++){
                var link_full=document.createElement("a");
                link_full.innerHTML=list_link[i].url;
                link_full.style.display="block";
                link_full.style.fontWeight="bold";
                link_full.style.cursor="pointer";
                link_full.addEventListener('click',function () {
                    window.open(this.innerHTML);
                });
                var link_cr=document.createElement("a");
                link_cr.innerHTML=list_link[i].link;
                link_cr.style.display="block";
                var btn_delete=document.createElement("button");
                btn_delete.innerHTML='<i class="fa fa-trash-o"></i>';
                btn_delete.classList.add("buttonPro");
                btn_delete.classList.add("red");
                btn_delete.classList.add("small");
                btn_delete.classList.add("btn_delete");
                btn_delete.setAttribute("id_link",list_link[i].id);
                btn_delete.addEventListener('click',function () {
                    delete_link_by_account(this.getAttribute("id_link"));
                });
                var btn_detail=document.createElement("button");
                btn_detail.innerHTML='<i class="fa fa-info" aria-hidden="true"></i>';
                btn_detail.classList.add("buttonPro");
                btn_detail.classList.add("blue");
                btn_detail.classList.add("small");
                btn_detail.classList.add("btn_delete");
                btn_detail.setAttribute("detail",list_link[i].detail);
                btn_detail.addEventListener('click',function () {
                    window.open(this.getAttribute("detail"));
                });

                var item_link = document.createElement("div");
                item_link.appendChild(btn_delete);
                item_link.appendChild(btn_detail);
                item_link.appendChild(link_full);
                item_link.appendChild(link_cr);
                item_link.classList.add("item");
                area_list_link.appendChild(item_link);
            }

        }
    });
}

function delete_link_by_account(id_link) {
    $("#loading").fadeIn(200);
    $.ajax({
        url: url_act,
        jsonp: "delete_link_by_account",
        type: "post",
        data: "function=delete_link_by_account&lang="+lang+"&id_device="+id_device+"&id_link="+id_link,
        success: function(data, textStatus, jqXHR)
        {
            $("#loading").fadeOut(200);
            show_list_link_by_account();
        }
    });
}

function show_login_account() {
    var line=document.createElement("div");
    line.classList.add('line');
    var label_phone=document.createElement("label");
    label_phone.innerHTML="Phone number";
    label_phone.classList.add('label');
    label_phone.setAttribute("val","account_phone");
    label_phone.classList.add("lang");
    var login_error=document.createElement("strong");
    login_error.innerHTML="Login failed, please check your password";
    login_error.classList.add("error");
    login_error.classList.add("lang");
    login_error.setAttribute("val","account_login_fail");
    var inp_phone=document.createElement("input");
    inp_phone.setAttribute("id","user_phone");
    inp_phone.setAttribute("type","text");
    inp_phone.classList.add("inp");
    inp_phone.classList.add("pl");
    inp_phone.setAttribute("placeholder","Enter data here ...");
    var label_password=document.createElement("label");
    label_password.innerHTML="Password";
    label_password.classList.add("lang");
    label_password.classList.add('label');
    label_password.setAttribute("val","password");
    var inp_password=document.createElement("input");
    inp_password.setAttribute("id","user_password");
    inp_password.setAttribute("type","password");
    inp_password.classList.add("inp");
    inp_password.classList.add("pl");
    inp_password.setAttribute("placeholder","Enter data here ...");
    var btn_login=document.createElement("button");
    btn_login.classList.add("buttonPro");
    btn_login.classList.add("green");
    btn_login.classList.add("lang");
    btn_login.setAttribute('val','completed');
    btn_login.innerHTML="Completed";
    btn_login.addEventListener('click',function () {
        $("#loading").fadeIn(200);
        $.ajax({
            url: url_act,
            jsonp: "logincallback",
            type: "post",
            data: "function=logincallback&lang="+lang+"&user_phone="+$("#user_phone").val()+"&user_password="+$("#user_password").val(),
            success: function(data, textStatus, jqXHR)
            {
                $("#loading").fadeOut(200);
                if(data=="none"){
                    login_error.style.display="block";
                }else {
                    var obj_user = JSON.parse(data);
                    chrome.storage.local.set({data_user: obj_user}, function () {
                        console.log(obj_user);
                        show_main();
                    });
                    toDataURL(obj_user.avatar,function(dataUrl) {
                        chrome.storage.local.set({data_img_avatar:dataUrl}, function () {})
                    });
                }
            }
        });
    });
    var btn_back=document.createElement("button");
    btn_back.classList.add("buttonPro");
    btn_back.classList.add("blue");
    btn_back.classList.add('lang');
    btn_back.setAttribute('val','close');
    btn_back.innerHTML="Trở về";
    btn_back.addEventListener('click',function () {
        show_main();
    });

    area_list_link.innerHTML="";
    body_main.innerHTML="<strong class='lang' val='account_login'>Đăng nhập</strong>";
    body_main.appendChild(label_phone);
    body_main.appendChild(login_error);
    body_main.appendChild(inp_phone);
    body_main.appendChild(label_password);
    body_main.appendChild(inp_password);
    body_main.appendChild(line);
    area_login.innerHTML="";
    area_login.appendChild(btn_login);
    area_login.appendChild(btn_back);
    show_lang();
}



function check_and_show_login() {
    chrome.storage.local.get('data_user', function (result) {
        var obj_user=result.data_user;
        area_login.innerHTML="";
        if(obj_user) {
            var btn_logout=document.createElement("button");
            btn_logout.classList.add("buttonPro");
            btn_logout.classList.add("orange");
            btn_logout.classList.add("small");
            btn_logout.classList.add('lang');
            btn_logout.setAttribute("val","logout");
            btn_logout.innerHTML="Đăng Xuất";
            btn_logout.addEventListener('click',function () {
                logout_account();
            });
            id_device=obj_user.id_device;

            var avatar_user=document.createElement("img");
            avatar_user.setAttribute("src","images/pic_contact.png");
            avatar_user.classList.add('user_avatar');
            img_avatar=avatar_user;
            avatar_user.addEventListener('click',function () {
                window.open(obj_user.link);
            });
            area_login.appendChild(avatar_user);
            var name_user=document.createElement("strong");
            name_user.innerHTML=obj_user.name;
            name_user.style.display="block";
            area_login.appendChild(name_user);
            var name_address=document.createElement("span");
            name_address.innerHTML=obj_user.address;
            name_address.style.display="block";
            var name_sdt=document.createElement("span");
            name_sdt.innerHTML=obj_user.sdt;
            name_sdt.style.display="block";
            if(obj_user.address!="")area_login.appendChild(name_address);
            if(obj_user.sdt!="")area_login.appendChild(name_sdt);

            area_login.appendChild(btn_logout);
            show_list_link_by_account();
            load_img_avatar();
        }else{
            var line=document.createElement("div");
            line.classList.add('line');
            var btn_login=document.createElement("button");
            btn_login.classList.add("buttonPro");
            btn_login.classList.add("orange");
            btn_login.classList.add("lang");
            btn_login.innerHTML="Đăng nhập";
            btn_login.setAttribute("val","account_login");
            btn_login.addEventListener('click',function () {
                show_login_account();
            });
            line.appendChild(btn_login);
            area_login.innerHTML="<img  src='images/logo.png' class='logo_login'/> <span class='lang' val='btn_login_google'>Đăng nhập bằng tài khoản carrot để quản lý các liên kết rút gọn của bạn</span>";
            area_login.appendChild(line);
            show_list_link();
        }
    });
}

function logout_account() {
    chrome.storage.local.remove(["data_user"],function(){
        var error = chrome.runtime.lastError;
        if (error) {
            console.error(error);
        }else{
            id_device="";
            show_main();
        }
    })
}

function show_select_lang(){
    $("#loading").fadeIn(200);
    $.ajax({
        url: url_act,
        jsonp: "show_select_lang",
        type: "post",
        data: "function=show_select_lang",
        success: function(data, textStatus, jqXHR)
        {
            $("#loading").fadeOut(200);
            body_main.innerHTML="";
            area_login.innerHTML="";
            var obj_data=JSON.parse(data);
            var list_country=obj_data.list_data;
            for(var i=0;i<list_country.length;i++){
                var item_lang=document.createElement("div");
                item_lang.classList.add("item_lang");
                var img_lang=document.createElement("img");
                img_lang.setAttribute("src",list_country[i].url);
                item_lang.appendChild(img_lang);
                var name_lang=document.createElement("strong");
                name_lang.innerHTML=list_country[i].name;
                item_lang.setAttribute("lang_key",list_country[i].key);
                item_lang.setAttribute("url_icon",list_country[i].url);
                item_lang.setAttribute("icon",list_country[i].icon);
                item_lang.appendChild(name_lang);
                item_lang.addEventListener("click", function () {
                    $("#loading").fadeIn(200);
                    var key_lang=this.getAttribute('lang_key');
                    lang=key_lang;
                    btn_lang.setAttribute("src",this.getAttribute('url_icon'));
                    toDataURL(this.getAttribute('icon'),function(dataUrl) {
                        chrome.storage.local.set({data_img_lang:dataUrl}, function () {})
                    });
                    $.ajax({
                        url: url_act,
                        jsonp: "download_lang",
                        type: "post",
                        data: "function=download_lang&lang_key="+key_lang,
                        success: function(data_lang, textStatus, jqXHR)
                        {
                            var lang_app=JSON.parse(data_lang);
                            chrome.storage.local.set({lang_app:lang_app}, function () {
                                show_main();
                            });
                            $("#loading").fadeOut(200);
                        }
                    });
                });
                body_main.appendChild(item_lang);
            }
            area_login.innerHTML="";
            area_list_link.innerHTML="";
            var btn_back=document.createElement("button");
            btn_back.classList.add("buttonPro");
            btn_back.classList.add("blue");
            btn_back.innerHTML="Back";
            btn_back.classList.add('lang');
            btn_back.setAttribute('val','close');
            btn_back.addEventListener('click',function () {
                show_main();
            });
            area_login.appendChild(btn_back);
            show_lang();
        }
    });
}


function show_lang() {
    chrome.storage.local.get('lang_app', function (result) {
        var obj_data_lang= result.lang_app;
        $(".lang").each(function () {
            var key_lang=$(this).attr('val');
            $(this).html(obj_data_lang[key_lang]);
        });
        $(".pl").each(function () {
            $(this).attr('placeholder',obj_data_lang['inp_tip']);
        });
    });
}

function  show_link_done(url_img,link) {
    var label_link_done=document.createElement("label");
    label_link_done.innerHTML="You can use the link below to replace the old link";
    label_link_done.classList.add('label');
    label_link_done.setAttribute("val","link_done_tip");
    label_link_done.classList.add("lang");
    var line_link=document.createElement("div");
    line_link.classList.add("line");
    var img_qr=document.createElement("img");
    img_qr.setAttribute("src",url_img);
    var link_act=document.createElement("a");
    link_act.innerHTML=link;
    link_act.classList.add("link");
    link_act.setAttribute("href",link);
    line_link.appendChild(link_act);
    body_main.innerHTML="";
    area_list_link.innerHTML="";
    body_main.appendChild(label_link_done);
    body_main.appendChild(line_link);
    body_main.appendChild(img_qr);
    area_login.innerHTML="";
    var btn_back=document.createElement("button");
    btn_back.classList.add("buttonPro");
    btn_back.classList.add("blue");
    btn_back.innerHTML="Back";
    btn_back.classList.add('lang');
    btn_back.setAttribute('val','close');
    btn_back.addEventListener('click',function () {
        show_main();
    });
    area_login.appendChild(btn_back);
    show_lang();
}

function isValidURL(string) {
    var res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    return (res !== null)
};

function toDataURL(src, callback, outputFormat) {
    var img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function() {
        var canvas = document.createElement('CANVAS');
        var ctx = canvas.getContext('2d');
        var dataURL;
        canvas.height = this.naturalHeight;
        canvas.width = this.naturalWidth;
        ctx.drawImage(this, 0, 0);
        dataURL = canvas.toDataURL(outputFormat);
        callback(dataURL);
    };
    img.src = src;
    if (img.complete || img.complete === undefined) {
        img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
        img.src = src;
    }
}

function load_img_lang() {
    chrome.storage.local.get({data_img_lang: []}, function (result) {
        if(result.data_img_lang!="") {
            btn_lang.setAttribute("src", result.data_img_lang);
        }
    });
}

function  load_img_avatar() {
    chrome.storage.local.get({data_img_avatar: []}, function (result) {
        if(result.data_img_avatar!="") {
            if(img_avatar!=null) {
                img_avatar.setAttribute("src", result.data_img_avatar);
            }
        }
    });
}

function show_footer() {
    area_footer.innerHTML="";
    var link_store=document.createElement("strong");
    link_store.innerHTML="Carrotstore.com";
    link_store.classList.add('label');
    link_store.classList.add('lang');
    link_store.style.cursor="pointer";
    link_store.addEventListener('click',function () {
        window.open("https://carrotstore.com/");
    });
    var label_other_app=document.createElement("label");
    label_other_app.innerHTML="Other application";
    label_other_app.classList.add("lang");
    label_other_app.setAttribute("val","other_app");
    area_footer.appendChild(link_store);
    area_footer.appendChild(label_other_app);
    var box_ads=document.createElement("div");
    box_ads.classList.add("line");
    box_ads.classList.add("ads");
    $.ajax({
        url: url_act,
        jsonp: "other_app",
        type: "post",
        data: "function=other_app&lang="+lang,
        success: function(data_app, textStatus, jqXHR)
        {
            var list_app=JSON.parse(data_app);
            for (var i=0;i<list_app.length;i++){
                var item_ads=document.createElement("img");
                item_ads.setAttribute("src",list_app[i].id);
                item_ads.setAttribute("link",list_app[i].url);
                item_ads.addEventListener('click',function () {
                    window.open(this.getAttribute("link"));
                });
                box_ads.appendChild(item_ads);
            }
            area_footer.appendChild(box_ads);
        }
    });

}