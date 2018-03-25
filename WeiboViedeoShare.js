/**
 * Version          : 0.0.1
 * Author           : LisonFan
 * Home             : https://github.com/LisonFan/JSBox-Script
 * Support List     : 微博视频、秒拍
 */

mian()

function mian() {
    var link = $context.link || $clipboard.link

    if (!link) {
        $ui.alert({
            title: "错误",
            message: "传入的不是一个链接"
        })
        return
    }

    $ui.loading("处理中...")

    if (link.indexOf("t.cn") > -1) {
        $http.lengthen({
            url: link,
            handler: function (url) {
                linkIsInTheSupportList(url)
            }
        })
    } else {
        linkIsInTheSupportList(link)
    }
}

function linkIsInTheSupportList(url) {
    var isSupport = false

    if (url.indexOf("weibo.com") > -1 || url.indexOf("video.weibo.com") > -1 || url.indexOf("m.weibo.cn") > -1 || url.indexOf("www.miaopai.com") > -1) {
        isSupport = true
    } else {
        isSupport = false
    }

    if (isSupport === false) {
        $ui.loading(false)
        $ui.alert({
            title: "错误",
            message: "传入的链接不支持"
        })
    } else if (isSupport === true) {
        resolveVideoDownloadURL(url)
    }
}

function resolveVideoDownloadURL(url) {
    if (url.indexOf("video.weibo.com") > -1) {
        $http.request({
            method: "GET",
            url: url,
            header: {
                "user-agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 10_0_3 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) Version/10.0 Mobile/14A551 Safari/602.1"
            },
            handler: function (resp) {
                var data = resp.data
                if (data) {
                    var regx = /(src=')(.)[^\']+/g
                    var video_url_regx = regx.exec(data)
                    if (video_url_regx) {
                        var video_url = video_url_regx[0].split("\"")[2]
                        if (video_url.indexOf("http://" || "https://") > -1) {
                            downloadVideo(video_url)
                        } else {
                            $ui.alert({
                                title: "错误",
                                message: "找不到视频链接",
                            })
                            return
                        }
                    } else {
                        $ui.alert({
                            title: "错误",
                            message: "找不到视频链接",
                        })
                        return
                    }
                } else {
                    $ui.alert({
                        title: "错误",
                        message: resp,
                    })
                }
            }
        })
    } else if (url.indexOf("www.miaopai.com") > -1) {
        $http.request({
            method: "GET",
            url: url,
            header: {
                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36"
            },
            handler: function (resp) {
                var data = resp.data
                if (data) {
                    var regx = /(videoSrc\"\:)(.)[^\"]+/g
                    var video_url_regx = regx.exec(data)
                    if (video_url_regx) {
                        var video_url = video_url_regx[0].split("\"")[2]
                        if (video_url.indexOf("http://" || "https://") > -1) {
                            downloadVideo(video_url)
                        } else {
                            $ui.alert({
                                title: "错误",
                                message: "找不到视频链接",
                            })
                            return
                        }
                    } else {
                        $ui.alert({
                            title: "错误",
                            message: "找不到视频链接",
                        })
                        return
                    }
                } else {
                    $ui.alert({
                        title: "错误",
                        message: resp,
                    })
                }
            }
        })
    } else {
        $http.request({
            method: "GET",
            url: url,
            header: {
                "user-agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 10_0_3 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) Version/10.0 Mobile/14A551 Safari/602.1"
            },
            handler: function (resp) {
                var data = resp.data
                if (data) {
                    var regx = /(stream_url_hd)(.)+/g
                    var video_url_regx = regx.exec(data)
                    if (video_url_regx) {
                        var video_url = video_url_regx[0].split("\"")[2]
                        if (video_url.indexOf("http://" || "https://") > -1) {
                            downloadVideo(video_url)
                        } else {
                            $ui.alert({
                                title: "错误",
                                message: "找不到视频链接",
                            })
                            return
                        }
                    } else {
                        $ui.alert({
                            title: "错误",
                            message: "找不到视频链接",
                        })
                        return
                    }                    
                } else {
                    $ui.alert({
                        title: "错误",
                        message: resp,
                    })
                    return
                }
            }
        })
    }
}

function downloadVideo(url) {
    $ui.loading(false)
    var link = url
    if (link.indexOf("http://") > -1) {
        link = link.replace(/http:\/\//, "https://")
    }
    $http.download({
        url: link,
        header: {
            "user-agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 10_0_3 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) Version/10.0 Mobile/14A551 Safari/602.1"
        },
        progress: function (bytesWritten, totalBytes) {
            var percentage = bytesWritten * 1.0 / totalBytes
        },
        handler: function (resp) {
            var file = resp.data
            if (file) {
                $share.sheet(file)
            } else {
                $ui.alert({
                    title: "错误",
                    message: resp
                })
            }
        }
    })
}
