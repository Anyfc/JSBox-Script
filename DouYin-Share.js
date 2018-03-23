main()

function main() {
    var douyin_url = $clipboard.link
    if (isDouYinURL(douyin_url) > 0) {
        $ui.loading("处理中...")
        getDouYinVideoDownloadURL(douyin_url)
    } else {
        $ui.alert({
            title: "错误",
            message: "传入的链接不是抖音的链接！",
        })
    }
}

function isDouYinURL(url) {
    var douyin_url = /www.douyin.com/
    return douyin_url.test(url)
}

function getDouYinVideoDownloadURL(url) {
    $http.get({
        url: url,
        handler: function (resp) {
            var data = resp.data
            if (data) {
                var regx = /(?=video_id\=)[^"]+/gi
                var douyin_video_id = regx.exec(data)[0].split("\\")[0]
                var douyin_video_download_url = "https://aweme.snssdk.com/aweme/v1/play/?" + douyin_video_id
                shareDouYinVideo(douyin_video_download_url)
            } else {
                $ui.alert({
                    title: "错误",
                    message: "数据获取失败",
                })
            }
        }
    })
}

function shareDouYinVideo(url) {
    $http.lengthen({
        url: url,
        handler: function (url) {
            $http.download({
                url: url,
                progress: function (bytesWritten, totalBytes) {
                    var percentage = bytesWritten * 1.0 / totalBytes
                },
                handler: function (resp) {
                    var file = resp.data
                    $ui.loading(false)
                    $share.sheet(file)
                }
            })
        }
    })
}
