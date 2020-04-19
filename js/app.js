var url_act='http://carrotstore.com/app_mobile/shortenlinks/app_chorme_extesion.php';
var lang='en';

var area_login=null;
var area_list_link=null;
var body_main=null;
var id_device='';
var btn_lang=null;

$(function () {

    body_main=document.querySelectorAll("#body_main");
    body_main=body_main[0];
    area_login=document.querySelectorAll("#login");
    area_login=area_login[0];
    area_list_link=document.querySelectorAll("#list_link");
    area_list_link=area_list_link[0];
    btn_lang=document.querySelectorAll("#img_lang");
    btn_lang=btn_lang[0];
    btn_lang.addEventListener('click',function () {
        show_select_lang();
    });


    show_main();
});

function show_main(){
    var label_link=document.createElement("label");
    label_link.innerHTML="After shortening the link, you will have a new link that is shorter and easier to remember. Easy to share and send";
    label_link.classList.add('label');
    label_link.classList.add('lang');
    label_link.setAttribute("val","app_title_tip");
    var inp_link=document.createElement("input");
    inp_link.setAttribute("id","inp_link");
    inp_link.setAttribute("type","text");
    inp_link.setAttribute("placeholder","Enter link here...");
    inp_link.classList.add("inp");
    var btn_create_link=document.createElement("button");
    btn_create_link.innerHTML="Create shortened links";
    btn_create_link.classList.add("buttonPro");
    btn_create_link.classList.add("green");
    btn_create_link.classList.add("large");
    btn_create_link.classList.add("lang");
    btn_create_link.setAttribute("val","create_link_shortened");
    btn_create_link.addEventListener('click',function () {
        var inp_link=$("#inp_link").val();
        chrome.storage.local.get({list_link: []}, function (result) {
            var data_lik = result.list_link;
            data_lik.push({'link': inp_link, HasBeenUploadedYet: false});
            chrome.storage.local.set({list_link: data_lik}, function () {
                console.log(result.list_link);
                //show_list_link();
                show_link_done();
            });
        });
    });
    body_main.innerHTML="";
    body_main.appendChild(label_link);
    body_main.appendChild(inp_link);
    body_main.appendChild(btn_create_link);
    show_list_link();
    check_and_show_login();
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
            btn_delete.innerHTML="Delete";
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

function show_login_account() {
    var line=document.createElement("div");
    line.classList.add('line');
    var label_phone=document.createElement("label");
    label_phone.innerHTML="Số điện thoại";
    label_phone.classList.add('label');
    label_phone.setAttribute("val","account_phone");
    label_phone.classList.add("lang");
    var inp_phone=document.createElement("input");
    inp_phone.setAttribute("id","user_phone");
    inp_phone.setAttribute("type","text");
    inp_phone.classList.add("inp");
    inp_phone.setAttribute("placeholder","Nhập số điện thoại của bạn...");
    var label_password=document.createElement("label");
    label_password.innerHTML="Mật khẩu";
    label_password.classList.add("lang");
    label_password.classList.add('label');
    label_password.setAttribute("val","password");
    var inp_password=document.createElement("input");
    inp_password.setAttribute("id","user_password");
    inp_password.setAttribute("type","password");
    inp_password.classList.add("inp");
    inp_password.setAttribute("placeholder","Nhập mật khẩu vào đây...");
    var btn_login=document.createElement("button");
    btn_login.classList.add("buttonPro");
    btn_login.classList.add("green");
    btn_login.classList.add("lang");
    btn_login.setAttribute('val','completed');
    btn_login.innerHTML="Completed";
    btn_login.addEventListener('click',function () {
        login_account($("#user_phone").val(),$("#user_password").val());
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
    body_main.appendChild(inp_phone);
    body_main.appendChild(label_password);
    body_main.appendChild(inp_password);
    body_main.appendChild(line);
    area_login.innerHTML="";
    area_login.appendChild(btn_back);
    area_login.appendChild(btn_login);
    show_lang();
}

function login_account(user_phone,user_password) {
    $("#loading").fadeIn(200);
    $.ajax({
        url: url_act,
        jsonp: "logincallback",
        type: "post",
        data: "function=logincallback&lang="+lang+"&user_phone="+user_phone+"&user_password="+user_password,
        success: function(data, textStatus, jqXHR)
        {
            $("#loading").fadeOut(200);
            var obj_user=JSON.parse(data);
            chrome.storage.local.set({data_user: obj_user}, function () {
                console.log(obj_user);
                show_main();
            });
        }
    });
}

function check_and_show_login() {
    chrome.storage.local.get('data_user', function (result) {
        var obj_user=result.data_user;
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
            area_login.innerHTML = "<img src='images/pic_contact.png' class='user_avatar'/><strong>" + obj_user.name+"</strong><br/>";
            if(obj_user.address!="") area_login.innerHTML =area_login.innerHTML+""+obj_user.address+"<br/>";
            if(obj_user.sdt!="") area_login.innerHTML =area_login.innerHTML+""+obj_user.sdt+"<br/>";
            area_login.appendChild(btn_logout);
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
                item_lang.appendChild(name_lang);
                item_lang.addEventListener("click", function () {
                    $("#loading").fadeIn(200);
                    var key_lang=this.getAttribute('lang_key');
                    btn_lang.setAttribute("src",this.getAttribute('url_icon'));
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
    });
}

function  show_link_done() {
    var label_link_done=document.createElement("label");
    label_link_done.innerHTML="You can use the link below to replace the old link";
    label_link_done.classList.add('label');
    label_link_done.setAttribute("val","link_done_tip");
    label_link_done.classList.add("lang");
    body_main.innerHTML="";
    area_list_link.innerHTML="";
    body_main.appendChild(label_link_done);
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