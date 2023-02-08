ìmport fs from 'fs'

$(document).ready(function () {

    var startDate = moment().subtract(7, 'days').format('YYYY-MM-DD');
    var endDate = moment().format('YYYY-MM-DD');
    var serviceList = new Array();
    var testValue = 0;
    var seriesOptions = [];
    var chart = null;
    var lastDate
    var day = 7
    var todayString = "";
    var title = ['RadonEye Pro',
        'RDS',
        'RadonEye CUBE',
        'FS301',
        'AQMAN',
        'DWM101',
        'RD200P',
        'RD200P2'
    ]

    var timeCount = 0
    var url = ['https://ftlab-vm-api.com/api/pro/devices/monitor',
        'https://ftlab-vm-api.com/api/rds/devices/monitor',
        'https://ftlab-vm-api.com/api/cube/devices/monitor',
        'https://radoneye-station.azurewebsites.net/api/monitor',//!! 안바꿔도됨
        'https://ftlab-vm-api.com/api/rsv2/devices/monitor?type=0',
        'https://ftlab-vm-api.com/api/rsv2/devices/monitor?type=1',
        'https://ftlab-vm-api.com/api/rmns/devices/monitor?type=0',
        'https://ftlab-vm-api.com/api/rmns/devices/monitor?type=1'
    ]
    displayServerList()
    setInterval(function () {
        displayServerList()

    }, 1000 * 60 * 10) // 10분 마다 업데이트

    function displayServerList() {
        timeCount++

        startDate = moment().subtract(day, 'days').format('YYYY-MM-DD');
        endDate = moment().format('YYYY-MM-DD');

        if (lastDate != endDate || timeCount >= 6) {
            var apiNum = 0
            apiTest(apiNum)
        }

        var today = new Date();
        var year = today.getFullYear();
        var month = ('0' + (today.getMonth() + 1)).slice(-2);
        var day = ('0' + today.getDate()).slice(-2);

        var hours = ('0' + today.getHours()).slice(-2);
        var minutes = ('0' + today.getMinutes()).slice(-2);
        var seconds = ('0' + today.getSeconds()).slice(-2);

        todayString = year + '-' + month + '-' + day;
        var timeString = hours + ':' + minutes + ':' + seconds;
        var updateString = todayString + " " + timeString
        document.getElementById("ft_header").innerHTML = "<h1>FTLab Monitoring System " + updateString + "</h1>"

    }
    function apiTest(num) {


        $.ajax({
            type: 'GET',
            url: url[num],
            async: false,
            success: function (res) {
                var data = res;
                serviceList[num] = data;

                var element = document.getElementsByClassName('service_page_list')
                element[num].innerHTML =
                    '<div class="container">' +
                    '<h2>' + title[num] + '</h2>' +
                    '<div id="server_condition">' +
                    '<span class="condition_check normal">' + '<i class="fa-solid fa-circle-check"></i>' + ' 정상' + '</span>' +
                    '</div>' +
                    '<div class="list-item" data-id"' + data.id + '">' +
                    '<div id="list-count">' +
                    '<p>' + '구동 장비 : ' + '<span class="nowCount">' + data.nowCount + '</span>' + '</p>' +
                    '<p>' + '등록된 장비 : ' + '<span class="allCount">' + data.allCount + '</span>' + '</p>' +
                    '</div>' +
                    '</div>'



                const content = "[정상]" + title[num] + " : " + data.nowCount

                fs.appendFile('./log/' + todayString, content, err => {
                    if (err) {
                        console.error(err)
                        return
                    }
                    //done!
                })
                num++;
                if (num < 8) {
                    apiTest(num)
                }
            },
            error: function (XMLHttpRequest, status, error) {


                var element = document.getElementsByClassName('service_page_list')

                //.service_page_list 내에 내용이 없으면
                element[num].innerHTML =
                    '<div class="container">' +
                    '<h2>' + title[num] + '</h2>' +
                    '<div id="server_condition">' +
                    '<span class="condition_check error">' + '<i class="fa-solid fa-circle-exclamation"></i>' + ' 오류' + '</span>' +
                    '</div>' +
                    '<div id="list-count">' +
                    '<p>' + '구동 장비 : ' + '<span class="nowCount">' + ' ' + '</span>' + '</p>' +
                    '<p>' + '등록된 장비 : ' + '<span class="allCount">' + ' ' + '</span>' + '</p>' +
                    '</div>'


                const content = "[오류]" + title[num]
                fs.appendFile('./log/' + todayString, content, err => {
                    if (err) {
                        console.error(err)
                        return
                    }
                    //done!
                })
                num++;
                if (num < 8) {
                    apiTest(num)
                }

            }

        });


    }

});
		//script finished