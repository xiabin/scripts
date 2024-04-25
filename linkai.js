/*


************************
QuantumultX 本地脚本配置:
************************

[task_local]
# 贴吧签到
0 9 * * * TieBa.js

[rewrite_local]
# 获取Cookie
https:\/\/link-ai\.tech\/.* url script-request-header linkai.js

[mitm] 
hostname= *.link-ai.tech


*/


const chavy = init()
const cookieName = 'linkai'
const KEY_signurl = 'chavy_sign_url_elinkai'
const KEY_signheaderauth = 'chavy_sign_header_auth_linkai'

const signinfo = {}
let VAL_signurl = chavy.getdata(KEY_signurl)
let VAL_signheaderauth = chavy.getdata(KEY_signheaderauth)



if (chavy.isRequest) {
    Getdata()
} else {
    ; (exec = async () => {
        chavy.log(`🔔 ${cookieName} 开始签到`)
        await signapp()
    })().catch((e) => chavy.log(`❌ ${cookieName} 签到失败: ${e}`))
        .finally(() => chavy.done())

}


function getData() {
    chavy.setdata(KEY_signurl, "https://link-ai.tech/api/chat/web/app/user/sign/in")
    var headerauth = $request.header['authorization']
    if (headerauth) {
        if (VAL_signheaderauth != undefined) {
            var cookie = chavy.setdata(KEY_signheaderauth, headerauth);
            if (!cookie) {
                chavy.msg("更新linkai auth 失败", "", "");
            } else {
                chavy.msg("更新linkai auth 成功 🎉", "", "");
            }
        } else {
            var cookie = chavy.setdata(KEY_signheaderauth, headerauth);
            if (!cookie) {
                chavy.msg("首次写入linkai auth失败‼️", "", "");
            } else {
                chavy.msg("首次写入linkai auth成功 🎉", "", "");
            }
        }
    }
    chavy.done()
}

function signapp() {
    const headers = {
        "accept": "application/json, text/plain, */*",
        "accept-language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7",
        "authorization": VAL_signheaderauth,
        "cache-control": "no-cache",
        "pragma": "no-cache",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "Referer": "https://link-ai.tech/console/account",
        "Referrer-Policy": "strict-origin-when-cross-origin"
    };
    return new Promise((resolve, reject) => {
        const url = { url: VAL_signurl, headers: headers }
        chavy.get(url, (error, response, data) => {
            try {
                let msg;
                console.log(response.body);
                const obj = JSON.parse(response.body)
                if (obj.message) {
                    msg = obj.message
                } else {
                    msg = response.body
                }
                chavy.msg("link-ai", "签到情况", msg); // Success!
                resolve()
            } catch (e) {
                chavy.msg(cookieName, `签到结果: 失败`, `说明: ${e}`)
                chavy.log(`❌ ${cookieName} sign - 签到失败: ${e}`)
                chavy.log(`❌ ${cookieName} sign - response: ${JSON.stringify(response)}`)
                resolve()
            }
        })
    })
}



function init() {
    isSurge = () => {
        return undefined === this.$httpClient ? false : true
    }
    isQuanX = () => {
        return undefined === this.$task ? false : true
    }
    getdata = (key) => {
        if (isSurge()) return $persistentStore.read(key)
        if (isQuanX()) return $prefs.valueForKey(key)
    }
    setdata = (key, val) => {
        if (isSurge()) return $persistentStore.write(key, val)
        if (isQuanX()) return $prefs.setValueForKey(key, val)
    }
    msg = (title, subtitle, body) => {
        if (isSurge()) $notification.post(title, subtitle, body)
        if (isQuanX()) $notify(title, subtitle, body)
    }
    log = (message) => console.log(message)
    get = (url, cb) => {
        if (isSurge()) {
            $httpClient.get(url, cb)
        }
        if (isQuanX()) {
            url.method = 'GET'
            $task.fetch(url).then((resp) => cb(null, resp, resp.body))
        }
    }
    post = (url, cb) => {
        if (isSurge()) {
            $httpClient.post(url, cb)
        }
        if (isQuanX()) {
            url.method = 'POST'
            $task.fetch(url).then((resp) => cb(null, resp, resp.body))
        }
    }
    done = (value = {}) => {
        $done(value)
    }
    isRequest = typeof $request != "undefined"

    return { isSurge, isQuanX, msg, log, getdata, setdata, get, post, done，isRequest }
} /Users/xiabin / scripts