var app = angular.module('myApp',['ng','ngRoute']);

app.config(function($routeProvider){
    $routeProvider
        .when('/home',{templateUrl:'menu/home.html',controller:'home_c'})
        .when('/dataSource',{templateUrl:'menu/dataSource.html',controller:'dataSource_c'})
        .when('/targetSource',{templateUrl:'menu/targetSource.html',controller:'targetSource_c'})
        .when('/algorithm',{templateUrl:'menu/algorithm.html',controller:'algorithm_c'})
        .when('/sensitiveRule',{templateUrl:'menu/sensitiveRule.html',controller:'sensitiveRule_c'})
        .when('/taskList',{templateUrl:'menu/taskList.html',controller:'taskList_c'})
        .when('/createTask',{templateUrl:'menu/createTask.html',controller:'createTask_c'})
        .when('/log',{templateUrl:'menu/log.html',controller:'log_c'})
        .otherwise({redirectTo:'/home'});
});

app.factory('pageFun',function () {
    return{
        initPage : function (current,total,size) {
            var arr = [],i;
            if(total > size){
                if(current <= Math.ceil(size/2)){
                    for(i=0; i<size; i++){
                        arr.push(i+1);
                    }
                }else if(current >= total-(size-Math.ceil(size/2))){
                    for(i=total; i>total-size; i--){
                        arr.push(i);
                    }
                    arr.reverse();
                }else{
                    for(i=current-(Math.ceil(size/2)-1); i<current-(Math.ceil(size/2)-1)+size; i++){
                        arr.push(i);
                    }
                }
            }else{
                for(i=0; i<total; i++){
                    arr.push(i+1);
                }
            }
            return arr;
        },
        nextPage : function (current,total,size,callback) {
            if(current < total){
                callback(current+1,size);
            }else{
                console.log(123);
            }
        },
        prevPage: function (current,size,callback) {
            if (current > 1) {
                callback(current - 1,size);
            } else {
                console.log(123);
            }
        },
        togglePage : function (callback,page,size) {
            callback(page,size);
        },
        currentPage : function (arg,arg1) {
            return arg == arg1 && 'current';
        }
    }
});

app.factory('database', function ($http,pageFun) {
    return{
        testDatabaseUrl : '/dms/datasource/test_db_connect',
        testDatabase : function (obj,successCallback,failCallback) {
            if(obj.ip && obj.port && obj.username && obj.password && obj.databaseName){
                $http.post(this.testDatabaseUrl,obj).then(function (res) {
                    successCallback(res)
                },function (error) {
                    failCallback(error);
                });
            }else{
                failCallback();
            }
        },
        addDatabaseUrl : '/dms/datasource/create',
        addDatabase : function (obj,callback) {
            $http.post(this.addDatabaseUrl,obj).then(function (res) {callback(res);});
        },
        deleteDatabaseUrl : '/dms/datasource/',
        deleteDatabase : function (deleteId,callback) {
            $http.delete(this.deleteDatabaseUrl+deleteId).then(function (res) {
                res.data.message == 'SUCCESS' && callback();
            });
        },
        getDatabaseListUrl : '/dms/datasource',
        getDatabaseList : function (sourceType,page,size,searchContent,callback) {
            $http.get(this.getDatabaseListUrl+'?sourceType='+sourceType+'&page='+page+'&size='+size+'&query='+searchContent).then(function (res) {
                res.data.data.totalElements >= 0 && callback(res,pageFun);
            });
        },
        getTableListUrl : '/dms/datasource/tables/',
        getTableList : function (id,page,size,searchContent,callback) {
           $http.get(this.getTableListUrl+id+'?page='+page+'&size='+size+'&tableName='+searchContent).then(function (res) {
               res.data.data.totalElements >= 0 && callback(res,pageFun);
           });
        },
        getAllTableListUrl : '/dms/datasource/tables',
        getAllTableList : function (obj,callback) {
            $http.post(this.getAllTableListUrl,obj).then(function (res) {
                res.data.message >= 'SUCCESS' && callback(res);
            });
        },
        testHadTableNameUrl : '/dms/datasource/test/target',
        testHadTableName : function (obj,callback) {
            $http.post(this.testHadTableNameUrl,obj).then(function (res) {callback(res)});
        },
        getDatabaseDetailUrl : '/dds/scan/record',
        getDatabaseDetail : function (arr,callback) {
            $http.post(this.getDatabaseDetailUrl,arr).then(function (res) {
                res.data.message =='SUCCESS' && callback(res);
            });
        },
        updateDatabaseUrl : '/dms/extract_database_task/',
        updateDatabase : function (id,callback) {
            $http.post(this.updateDatabaseUrl+id).then(function (res) {
                callback(res);
            });
        },
        searchDatabaseStatusUrl : '/dms/extract_database_task/',
        searchDatabaseStatus : function (id,callback) {
            $http.get(this.searchDatabaseStatusUrl+id).then(function (res) {callback(res);});
        }
    }
});

app.factory('rule', function ($http,pageFun) {
    return{
        getAlgorithmListUrl : '/dds/algorithms',
        getAlgorithmList : function (page,size,callback) {
            $http.get(this.getAlgorithmListUrl+'?page='+page+'&size='+size).then(function (res) {
                res.data.data.totalElements >= 0 && callback(res,pageFun);
            });
        },
        getRuleListUrl : '/dds/rules',
        getRuleList : function (page,size,name,callback) {
            $http.get(this.getRuleListUrl+'?page='+page+'&size='+size+'&name='+name).then(function (res) {
                res.data.data.totalElements >= 0 && callback(res,pageFun);
            });
        },
        createRuleUrl : '/dds/rules',
        createRule : function (obj,callback) {
            $http.post(this.createRuleUrl,obj).then(function (res) {
                res.data.message == 'SUCCESS' && callback(res);
            });
        },
        setRuleUrl : '/dds/rules/',
        setRule : function (setId,obj,callback) {
            $http.put(this.setRuleUrl+setId,obj).then(function (res) {callback(res);});
        },
        deleteRuleUrl : '/dds/rules/',
        deleteRule : function (deleteId,callback) {
            $http.delete(this.deleteRuleUrl+deleteId).then(function (res) {
                res.data.message == 'SUCCESS' && callback(res);
            });
        }
    }
});

app.factory('task', function ($http,pageFun) {
    return{
        getTaskListUrl : '/tms/api/v1/tasks',
        getTaskList : function (status,policyType,targetType,searchContent,page,size,callback) {
            $http.get(this.getTaskListUrl+'?status='+status+'&policyType='+policyType+'&targetType='+targetType+'&searchKey='+searchContent+'&page='+page+'&size='+size).then(function (res) {
                res.data.data.totalElements >= 0 && callback(res,pageFun);
            });
        },
        createTaskUrl : '/tms/api/v1/tasks',
        createTask : function (obj,callback) {
            $http.post(this.createTaskUrl,obj).then(function (res) {
                res.data.status == 'CREATED' && callback(res);
            });
        },
        startTaskUrl : '/tms/api/v1/tasks/',
        startTask : function (uuid) {
            $http.put(this.startTaskUrl+uuid+'/start');
        },
        pauseTaskUrl : '/tms/api/v1/tasks/',
        pauseTask : function (uuid) {
            $http.put(this.startTaskUrl+uuid+'/pause');
        },
        cancelTaskUrl : '/tms/api/v1/tasks/',
        cancelTask : function (uuid) {
            $http.put(this.startTaskUrl+uuid+'/cancel');
        }
    }
});

app.factory('statistics', function ($http) {
    return{
        statisticsTaskUrl : '/tms/api/v1/tasks/index',
        statisticsTask : function (callback) {
            $http.get(this.statisticsTaskUrl).then(function (res) {
                res.data.status == 'OK' && callback(res);
            });
        },
        statisticsSensitiveUrl : '/dds/scan/index',
        statisticsSensitive : function (callback) {
            $http.get(this.statisticsSensitiveUrl).then(function (res) {
                res.data.message == 'SUCCESS' && callback(res);
            });
        }
    }
});

app.factory('upload', function ($http,$window) {
    return{
        fileUploadUrl : '/dms/file/upload',
        fileUpload : function (file,callback) {
            var fd = new FormData();
            fd.append('file', file);
            $http({
                method : 'post',
                url : '/dms/file/upload',
                data : fd,
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            }).then(function (res) {
                res.data.message == 'SUCCESS' && callback(res);
            });
        },
        fileDownloadUrl : 'dms/file/download/',
        fileDownload : function (uuid) {
            $window.location.href = this.fileDownloadUrl+uuid;
        }
    }
});

app.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attr) {
            var model = $parse(attr.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);

app.run(['$rootScope', '$location', 'pageFun', function($rootScope, $location ,pageFun){
    //笼罩层
    $rootScope.maskUI = {display : 'none'};
    $rootScope.init = function () {
        $rootScope.homeNav = false;
        $rootScope.dataSourceNav = false;
        $rootScope.targetSourceNav = false;
        $rootScope.algorithmNav = false;
        $rootScope.sensitiveRuleNav = false;
        $rootScope.taskListNav = false;
        $rootScope.createTaskNav = false;
        $rootScope.logNav = false;
        //数据清空
        $rootScope.pageData = null;
        $rootScope.dataList = null;
        //数据源管理直接脱敏
        $rootScope.dataSourceToCreateTaskObj = {
            id : null,
            name : null
        };
    };
    $rootScope.isCurrent = function (arg) {
        return arg && 'current'
    };
    $rootScope.href = function (arg,obj) {
        switch (arg){
            case 'home' : $location.path('/home').search({});break;
            case 'dataSource' : $location.path('/dataSource').search({});break;
            case 'targetSource' : $location.path('/targetSource').search({});break;
            case 'algorithm' : $location.path('/algorithm').search({});break;
            case 'sensitiveRule' : $location.path('/sensitiveRule').search({});break;
            case 'taskList' : $location.path('/taskList').search({});break;
            case 'createTask' : obj ? $location.path('/createTask').search(obj) : $location.path('/createTask').search({});break;
            case 'log' : $location.path('/log').search({});break;
        }
    };
    //更新函数
    $rootScope.updateData = function (res,pageFun) {
        $rootScope.dataList = res.data.data.content;
        $rootScope.currentPage = res.data.data.page;
        $rootScope.totalPage = res.data.data.totalPage;
        $rootScope.pageData = pageFun.initPage(res.data.data.page,res.data.data.totalPage,5);
    };
    //翻页
    $rootScope.isPageCurrent = pageFun.currentPage;
    $rootScope.nextPage = pageFun.nextPage;
    $rootScope.prevPage = pageFun.prevPage;
    $rootScope.togglePage = pageFun.togglePage;
    //测试数据库
    $rootScope.addDatabaseUI = {display : 'none'};
    $rootScope.testBtnUI = {display : 'inline-block'};
    $rootScope.confirmBtnUI = {display : 'none'};
    $rootScope.testTipBoxUI = {display : 'none'};
    $rootScope.isSuccess = 'success';
    $rootScope.isSuccessSpan = '连接成功';
    $rootScope.isTestBtnDisable = false;
    $rootScope.isSuccessTest = function () {
        return $rootScope.isSuccess;
    };
    $rootScope.toggleAddDatabase = function () {
        $rootScope.testBtnUI.display = 'inline-block';
        $rootScope.confirmBtnUI.display = 'none';
        $rootScope.testTipBoxUI.display = 'none';
        $rootScope.addDatabaseUI.display = $rootScope.addDatabaseUI.display == 'none' ? 'block' : 'none';
    };
    $rootScope.hideTestTipBox = function () {
        $rootScope.testTipBoxUI.display = 'none';
        $rootScope.testBtnUI.display = 'inline-block';
        $rootScope.confirmBtnUI.display = 'none';
    };
    $rootScope.successCallback = function (res) {
        $rootScope.isTestBtnDisable = false;
        if(res.data.message == 'SUCCESS'){
            $rootScope.isSuccess = 'success';
            $rootScope.isSuccessSpan = '连接成功';
            $rootScope.testBtnUI.display = 'none';
            $rootScope.confirmBtnUI.display = 'inline-block';
            $rootScope.testTipBoxUI.display = 'block';
        }else{
            $rootScope.isSuccess = 'fail';
            $rootScope.isSuccessSpan = res.data.error;
            $rootScope.testBtnUI.display = 'inline-block';
            $rootScope.confirmBtnUI.display = 'none';
            $rootScope.testTipBoxUI.display = 'block';
        }
    };//测试成功的回调函数
    $rootScope.failCallback = function (error) {
        $rootScope.isTestBtnDisable = false;
        $rootScope.isSuccess = 'fail';
        $rootScope.isSuccessSpan = error ? '无法连接,请确认录入信息正确,且数据库打开!' : '无法连接,录入信息不能为空!';
        $rootScope.testBtnUI.display = 'inline-block';
        $rootScope.confirmBtnUI.display = 'none';
        $rootScope.testTipBoxUI.display = 'block';
    };//测试失败的回调函数
    //删除提示框的显示
    $rootScope.deleteBoxUI = {display : 'none'};
    //打开删除提示框
    $rootScope.openDeleteBox = function (deleteId) {
        $rootScope.maskUI.display = 'block';
        $rootScope.deleteBoxUI.display = 'block';
        $rootScope.deleteId = deleteId;
    };
    //关闭删除提示框
    $rootScope.closeDeleteBox = function () {
        $rootScope.maskUI.display = 'none';
        $rootScope.deleteBoxUI.display = 'none';
        $rootScope.deleteId = null;
    };
    //搜索
    $rootScope.search = function (size,callback) {callback(1,size);};

    $rootScope.client = Stomp.over(new SockJS('/endpointChat'));

    $rootScope.client.connect({},function () {
        $rootScope.client.subscribe('/topic/progress', function (res) {
            angular.forEach($rootScope.dataTaskList,function (data) {
                if(data.uuid == JSON.parse(res.body).taskId){
                    data.status = JSON.parse(res.body).progress;
                    $rootScope.$apply();
                }
            });
        });
    });
}]);

app.controller('home_c', ['$scope', '$http', '$rootScope', 'statistics', function ($scope, $http, $rootScope, statistics) {
    $rootScope.init();
    $rootScope.homeNav = true;
    $scope.barX = [];
    $scope.barY = [];
    $scope.topBarX = [];
    $scope.topBarY = [];

    $scope.bar = function () {
        var option = {
            title: {
                text: '脱敏任务量',
                textStyle : {
                    color : '#797d80',
                    fontWeight : 'normal'
                },
                top : 10,
                left : 10
            },
            color: ['#3ec9ff'],
            backgroundColor : '#f7f7f7',
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis : [
                {
                    type : 'category',
                    data : $scope.barX,
                    axisTick: {
                        alignWithLabel: true
                    }
                }
            ],
            yAxis : [
                {
                    type : 'value'
                }
            ],
            series : [
                {
                    name:'脱敏任务量',
                    type:'bar',
                    barWidth: '60%',
                    data:$scope.barY
                }
            ]
        };
        var myChart = echarts.init($('.bar')[0]);
        myChart.setOption(option);
    };
    $scope.topBar = function () {
        var option = {
            title: {
                text: '敏感信息TOP10',
                textStyle : {
                    color : '#797d80',
                    fontWeight : 'normal'
                },
                top : 10,
                left : 10
            },
            color: ['#3ec9ff'],
            backgroundColor : '#f7f7f7',
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis : [
                {
                    type : 'value'
                }
            ],
            yAxis : [
                {
                    type : 'category',
                    data : $scope.topBarX,
                    axisTick: {
                        alignWithLabel: true
                    }
                }
            ],
            series : [
                {
                    name:'敏感信息TOP10',
                    type:'bar',
                    barWidth: '60%',
                    data:$scope.topBarY
                }
            ]
        };
        var myChart = echarts.init($('.topBar')[0]);
        myChart.setOption(option);
    };
    statistics.statisticsTask(function (res) {
        $scope.barX = [];
        $scope.barY = [];
        $scope.totalTask = res.data.data.total;
        $scope.runningTask = res.data.data.running;
        $scope.costTask = res.data.data.cost;
        if(res.data.data.tasks){
            angular.forEach(res.data.data.tasks,function (data) {
                $scope.barX.push(data[0]);
                $scope.barY.push(data[1]);
            });
        }
        $scope.barX.reverse();
        $scope.barY.reverse();
        $scope.bar();
    });
    statistics.statisticsSensitive(function (res) {
        $scope.topBarX = [];
        $scope.topBarY = [];
        $scope.dealTaskTotal = res.data.data.process;
        if(res.data.data.top){
            angular.forEach(res.data.data.top,function (data) {
                $scope.topBarX.push(data[0]);
                $scope.topBarY.push(data[1]);
            });
        }
        $scope.topBarX.reverse();
        $scope.topBarY.reverse();
        $scope.topBar();
    });
}]);

app.controller('dataSource_c', ['$scope', '$rootScope', 'database', function ($scope, $rootScope, database) {
    $rootScope.init();
    $rootScope.dataSourceNav = true;
    $rootScope.addDatabaseUI.display = 'none';
    $scope.pageSize = 15;
    $scope.searchContent = '';
    $scope.tableSearchContent = '';
    $scope.databaseListUI = {display : 'block'};
    $scope.tableListUI = {display : 'none'};

    $scope.sensitivePercent = 0;
    $scope.sensitiveType = '';
    $scope.sensitiveColumn = '';
    $scope.sensitiveTopX = [];
    $scope.sensitiveTopY = [];
    //水球
    $scope.polo = function (data) {
        var option = {
            backgroundColor : '#e6e6e6',
            series: [{
                type: 'liquidFill',
                radius: '80%',
                waveLength: '50%',
                center: ['50%', '50%'],
                outline: {
                    show: true,
                    borderDistance: 1,
                    itemStyle: {
                        color: 'none',
                        borderColor: '#294D99',
                        borderWidth: 2,
                        shadowBlur: 20,
                        shadowColor: 'rgba(0, 0, 0, 0.25)'
                    }
                },
                label: {
                    normal: {
                        show: true,
                        textStyle: {
                            color: '#294D99',
                            insideColor: '#fff',
                            fontSize: 14,
                            fontWeight: 'bold',

                            align: 'center',
                            baseline: 'middle'
                        },
                        position: 'inside'
                    }
                },
                data: [data]
            }]
        };
        var myChart = echarts.init($scope.poloElem);
        myChart.setOption(option);
    };
    $scope.bar = function (x,y) {
        var option = {
            backgroundColor : '#e6e6e6',
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            grid: {
                left : 10,
                right : 10,
                bottom: 10,
                top : 10,
                containLabel: true,
                show : false
            },
            xAxis : [
                {
                    type : 'category',
                    data : x,
                    axisLine : {
                        lineStyle : {
                            width : 0
                        }
                    },
                    axisTick : {
                        lineStyle : {
                            width : 0
                        }
                    }

                }
            ],
            yAxis : [
                {
                    type : 'value',
                    show : false
                }
            ],
            series : [
                {
                    name:'数据量',
                    type:'bar',
                    barWidth : 20,
                    itemStyle: {
                        normal: {
                            color: function(params) {
                                //首先定义一个数组
                                var colorList = [
                                    '#10c5e2','#85b964','#ead227','#ff7a22','#57cea8'
                                ];
                                return colorList[params.dataIndex]
                            }
                        }
                    },
                    data:y
                }
            ]
        };
        var myChart = echarts.init($scope.barElem);
        myChart.setOption(option);
    };
    $scope.poloElem = null;
    $scope.barElem = null;
    //获取数据库及表的详细信息
    $scope.getDatabaseAndTableDetail = function (res) {
        $scope.sensitivePercent = res.data.data.percent/100;
        $scope.sensitiveType = res.data.data.types.join('、');
        $scope.sensitiveColumn = res.data.data.sensitiveColumns.join('、');
        $scope.sensitiveTopX = [];
        $scope.sensitiveTopY = [];
        for(var i=0; i<4; i++){
            $scope.sensitiveTopX.push(res.data.data.top[i][0]);
            $scope.sensitiveTopY.push(res.data.data.top[i][1]/10000);
        }
        $scope.polo($scope.sensitivePercent);
    };
    //获取数据源数据库列表
    $scope.update = function (current,size) {
        $scope.poloElem = $('.databasePolo')[0];
        $scope.barElem = $('.bar')[0];
        database.getDatabaseList('import',current,size,$scope.searchContent,function (res,pageFun) {
            $rootScope.updateData(res,pageFun);
            if($rootScope.dataList){
                $scope.currentDatabaseName = $rootScope.dataList[0].databaseName;
                $scope.currentDatabaseIp = $rootScope.dataList[0].ip;
                $scope.currentDatabaseType = $rootScope.dataList[0].dbType;
                $scope.currentDatabaseComment = $rootScope.dataList[0].comment;
                $scope.databaseId = $rootScope.dataList[0].id;
                //清空信息
                $scope.sensitivePercent = 0;
                $scope.sensitiveType = '';
                $scope.sensitiveColumn = '';
                $scope.sensitiveTopX = [];
                $scope.sensitiveTopY = [];
                $scope.searchDatabaseStatus();
            }
        });
    };
    $scope.update(1,$scope.pageSize);
    //获取ID对应的数据库的表
    $scope.updateTableList = function (current,size) {
        $scope.poloElem = $('.tablePolo')[0];
        $scope.timer && clearTimeout($scope.timer);
        database.getTableList($scope.searchId,current,size,$scope.tableSearchContent,function (res,pageFun) {
            $rootScope.updateData(res,pageFun);
            if($rootScope.dataList){
                $scope.currentTableName = $rootScope.dataList[0].tableName;
                $scope.sensitivePercent = 0;
                $scope.sensitiveType = '';
                $scope.sensitiveColumn = '';
                if($rootScope.dataList[0].extractTableName){
                    database.getDatabaseDetail([$rootScope.dataList[0].extractTableName],$scope.getDatabaseAndTableDetail);
                }else{
                    $scope.polo($scope.sensitivePercent);
                }
            }
        });
    };
    //测试数据源数据库
    $scope.databaseIp = '10.0.0.219';
    $scope.databasePort = 3306;
    $scope.databaseUsername = 'root';
    $scope.databasePassword = 'admin';
    $scope.databaseName = 'test';
    $scope.databaseType = 'MySQL';
    $scope.databaseCommon = null;
    $scope.databaseHrefName = null;
    $scope.toggleDatabaseType = function (arg) {
        $scope.databaseType = arg;
        $rootScope.hideTestTipBox();
    };
    $scope.testDatabase = function () {
        if(!$rootScope.isTestBtnDisable){
            $rootScope.isTestBtnDisable = true;
            $scope.createObj = {
                databaseName : $scope.databaseName,
                ip : $scope.databaseIp,
                password: $scope.databasePassword,
                port : parseInt($scope.databasePort),
                dbType : $scope.databaseType,
                username : $scope.databaseUsername
            };
            database.testDatabase($scope.createObj,$rootScope.successCallback,$rootScope.failCallback);
        }
    };
    //新增数据源数据库
    $scope.createDatabase = function () {
        $scope.createObj.sourceType = 'import';
        $scope.createObj.temporary = false;
        $scope.createObj.comment = $scope.databaseCommon;//备注
        if($scope.databaseHrefName){
            if($scope.databaseHrefName.length > 10){
                $rootScope.isSuccess = 'fail';
                $rootScope.isSuccessSpan = '连接名长度不能超过10！';
            }else{
                $scope.createObj.name = $scope.databaseHrefName;//连接名
                database.addDatabase($scope.createObj,function (res) {
                    if(res.data.message == 'SUCCESS'){
                        $scope.databaseIp = '10.0.0.219';
                        $scope.databasePort = 3306;
                        $scope.databaseUsername = 'root';
                        $scope.databasePassword = 'admin';
                        $scope.databaseName = 'test';
                        $scope.databaseType = 'MySQL';
                        $scope.databaseCommon = null;
                        $scope.databaseHrefName = null;
                        $scope.update(1,$scope.pageSize);
                        $rootScope.toggleAddDatabase();
                    }else{
                        $rootScope.isSuccess = 'fail';
                        $rootScope.isSuccessSpan = res.data.error;
                    }
                });
            }
        }else{
            $rootScope.isSuccess = 'fail';
            $rootScope.isSuccessSpan = '连接名不能为空！';
        }
    };
    //删除数据源数据库
    $scope.deleteDatabase = function () {
        database.deleteDatabase($rootScope.deleteId,function () {
            $scope.update($rootScope.currentPage,$scope.pageSize);
            $rootScope.closeDeleteBox();
        });
    };

    //数据库列表双击
    $scope.dblClickDatabaseList = function (id) {
        $rootScope.dataList = null;
        $rootScope.pageData = null;
        $scope.tableSearchContent = '';
        $scope.searchId = id;
        $scope.updateTableList(1,$scope.pageSize);
        $scope.databaseListUI.display = 'none';
        $scope.tableListUI.display = 'block';
    };
    //返回数据库列表
    $scope.backToDatabaseList = function () {
        $rootScope.dataList = null;
        $rootScope.pageData = null;
        $scope.searchContent = '';
        $scope.databaseListUI.display = 'block';
        $scope.tableListUI.display = 'none';
        $scope.update(1,$scope.pageSize);
    };
    //数据库信息
    $scope.getDatabaseMsg = function (obj) {
        $scope.currentDatabaseName = obj.databaseName;
        $scope.currentDatabaseIp = obj.ip;
        $scope.currentDatabaseType = obj.dbType;
        $scope.currentDatabaseComment = obj.comment;
        $scope.databaseId = obj.id;
        //清空信息
        $scope.sensitivePercent = 0;
        $scope.sensitiveType = '';
        $scope.sensitiveColumn = '';
        $scope.sensitiveTopX = [];
        $scope.sensitiveTopY = [];
        $scope.searchDatabaseStatus();
    };
    //表信息
    $scope.getTableMsg = function (obj) {
        $scope.currentTableName = obj.tableName;
        //清空信息
        $scope.sensitivePercent = 0;
        $scope.sensitiveType = '';
        $scope.sensitiveColumn = '';
        if(obj.extractTableName){
            database.getDatabaseDetail([obj.extractTableName],$scope.getDatabaseAndTableDetail);
        }else{
            $scope.polo($scope.sensitivePercent);
        }
    };
    //常用数据源快捷脱敏
    $scope.toCreateTask = function () {
        $rootScope.href('createTask',{
            id : $scope.searchId,
            tableName : $scope.currentTableName,
            type : $scope.currentDatabaseType
        });
    };
    //提示框
    $scope.updateDatabaseTipUI = {display : 'none'};
    $scope.updateDatabase = function () {
        if(!$scope.isUpdateDatabaseDisable){
            $scope.isUpdateDatabaseDisable = true;
            database.updateDatabase($scope.databaseId, function (res) {
                $scope.updateDatabaseTipUI.display = 'block';
                $rootScope.maskUI.display = 'block';
                if(res.data.message == 'SUCCESS'){
                    $scope.errorText = '数据库更新中，请稍等···';
                    $scope.searchDatabaseStatus();
                }else{
                    $scope.errorText = '数据库不能链接，请查证！';
                    $scope.isUpdateDatabaseDisable = false;
                }
            });
        }
    };
    $scope.closeUpdateDatabaseTip = function () {
        $scope.updateDatabaseTipUI.display = 'none';
        $rootScope.maskUI.display = 'none';
    };
    //查询数据库更新状态
    $scope.isUpdateDatabaseDisable = false;
    $scope.searchDatabaseStatus = function () {
        if($scope.databaseListUI.display == 'block'){
            $scope.timer && clearTimeout($scope.timer);
            database.searchDatabaseStatus($scope.databaseId,function (res) {
                switch (res.data.message){
                    case 'doing' :
                        $scope.isUpdateDatabaseDisable = true;
                        $scope.timer = setTimeout($scope.searchDatabaseStatus,2000);
                        break;
                    case 'success' :
                        $scope.isUpdateDatabaseDisable = false;
                        $scope.closeUpdateDatabaseTip();
                        if(res.data.data){
                            database.getDatabaseDetail(res.data.data,function (res) {
                                $scope.getDatabaseAndTableDetail(res);
                                $scope.bar($scope.sensitiveTopX,$scope.sensitiveTopY);
                            });
                        }else{
                            $scope.polo($scope.sensitivePercent);
                            $scope.bar($scope.sensitiveTopX,$scope.sensitiveTopY);
                        }
                        break;
                    case 'fail' :
                        $scope.isUpdateDatabaseDisable = false;
                        $scope.closeUpdateDatabaseTip();
                        $scope.polo($scope.sensitivePercent);
                        $scope.bar($scope.sensitiveTopX,$scope.sensitiveTopY);
                        break;
                }
            });
        }
    };
}]);

app.controller('targetSource_c', ['$scope', '$rootScope', 'database', function ($scope, $rootScope ,database) {
    $rootScope.init();
    $rootScope.targetSourceNav = true;
    $rootScope.addDatabaseUI.display = 'none';
    $scope.pageSize = 18;
    $scope.searchContent = '';
    //获取目标源数据库列表
    $scope.update = function (current,size) {
        database.getDatabaseList('export',current,size,$scope.searchContent,function (res,pageFun) {
            $rootScope.updateData(res,pageFun);
            $rootScope.dataList && ($scope.databaseId = $rootScope.dataList[0].id);
        });
    };
    $scope.update(1,$scope.pageSize);
    //切换选中
    $scope.toggleCurrentDatabase = function (id) {
        $scope.databaseId = id
    };
    //测试目标源数据库
    $scope.databaseIp = '10.0.10.156';
    $scope.databasePort = 3306;
    $scope.databaseUsername = 'root';
    $scope.databasePassword = 'admin';
    $scope.databaseName = 'test';
    $scope.databaseType = 'MySQL';
    $scope.databaseCommon = null;
    $scope.databaseHrefName = null;
    $scope.toggleDatabaseType = function (arg) {
        $scope.databaseType = arg;
        $rootScope.hideTestTipBox();
    };
    $scope.testDatabase = function () {
        if(!$rootScope.isTestBtnDisable){
            $rootScope.isTestBtnDisable = true;
            $scope.createObj = {
                databaseName : $scope.databaseName,
                ip : $scope.databaseIp,
                password: $scope.databasePassword,
                port : parseInt($scope.databasePort),
                dbType : $scope.databaseType,
                username : $scope.databaseUsername
            };
            database.testDatabase($scope.createObj,$rootScope.successCallback,$rootScope.failCallback);
        }
    };
    //新增目标源数据库
    $scope.createDatabase = function () {
        $scope.createObj.sourceType = 'export';
        $scope.createObj.temporary = false;
        $scope.createObj.comment = $scope.databaseCommon;//备注
        if($scope.databaseHrefName){
            if($scope.databaseHrefName.length > 10){
                $rootScope.isSuccess = 'fail';
                $rootScope.isSuccessSpan = '连接名长度不能超过10！';
            }else{
                $scope.createObj.name = $scope.databaseHrefName;//连接名
                database.addDatabase($scope.createObj,function (res) {
                    if(res.data.message == 'SUCCESS'){
                        $scope.databaseIp = '10.0.10.156';
                        $scope.databasePort = 3306;
                        $scope.databaseUsername = 'root';
                        $scope.databasePassword = 'admin';
                        $scope.databaseName = 'test';
                        $scope.databaseType = 'MySQL';
                        $scope.databaseCommon = null;
                        $scope.databaseHrefName = null;
                        $scope.update(1,$scope.pageSize);
                        $rootScope.toggleAddDatabase();
                    }else{
                        $rootScope.isSuccess = 'fail';
                        $rootScope.isSuccessSpan = res.data.error;
                    }
                });
            }
        }else{
            $rootScope.isSuccess = 'fail';
            $rootScope.isSuccessSpan = '连接名不能为空！';
        }
    };
    //删除目标源数据库
    $scope.deleteDatabase = function () {
        database.deleteDatabase($rootScope.deleteId,function () {
            $scope.update($rootScope.currentPage,$scope.pageSize);
            $rootScope.closeDeleteBox();
        });
    };
}]);

app.controller('algorithm_c', ['$scope', '$rootScope', 'rule', function ($scope, $rootScope, rule) {
    $rootScope.init();
    $rootScope.algorithmNav = true;
    $scope.pageSize = 10;
    //获取算法列表
    $scope.update = function (current,size) {
        rule.getAlgorithmList(current,size,$rootScope.updateData);
    };
    $scope.update(1,$scope.pageSize);
}]);

app.controller('sensitiveRule_c', ['$scope', '$rootScope', 'rule', function ($scope, $rootScope, rule) {
    $rootScope.init();
    $rootScope.sensitiveRuleNav = true;
    $scope.pageSize = 5;
    $scope.searchContent = '';
    //获取已有规则列表
    $scope.update = function (current,size) {
        rule.getRuleList(current,size,$scope.searchContent,$rootScope.updateData);
    };
    $scope.update(1,$scope.pageSize);
    //获取算法列表
    $scope.updateAlgorithm = function (current,size) {
        rule.getAlgorithmList(current,size,function (res) {
            $scope.algorithmData = res.data.data.content;
            if($scope.algorithmData){
                angular.forEach($scope.algorithmData,function (data) {
                    $scope.createRuleData.modes.push(data.modes[0].uuid);
                });
            }
        });
    };
    $scope.updateAlgorithm(1,30);
    $scope.toggleAlgorithm = function (uuid,index) {
        $scope.createRuleData.modes[index] = uuid;
    };
    //配置新规则及修改规则
    $scope.createRuleData = {
        modes : [],
        name : null,
        remarks : null,
        temporary : false
    };
    $scope.error = null;
    $scope.errorUI = {display : 'none'};
    $scope.configRulesBoxUI = {display : 'none'};
    $scope.addRuleBtnSpan = null;
    $scope.openConfigRulesBox = function (setId,name,remarks,detail) {
        $rootScope.maskUI.display =  'block';
        $scope.configRulesBoxUI.display = 'block';
        $scope.createRuleData.modes = [];
        if(setId){
            $scope.addRuleBtnSpan = '确认修改';
            $scope.ruleName = name;
            $scope.remarks = remarks;
            $scope.setId = setId;
            angular.forEach(detail, function (detailData) {
                angular.forEach($scope.algorithmData, function (algorithmData,index) {
                    if(detailData.name == algorithmData.name){
                        $scope.createRuleData.modes[index] = detailData.uuid
                    }
                });
            });
        }else{
            $scope.addRuleBtnSpan = '确认添加';
            angular.forEach($scope.algorithmData,function (data) {
                $scope.createRuleData.modes.push(data.modes[0].uuid);
            });
        }
    };
    $scope.closeConfigRulesBox = function () {
        $rootScope.maskUI.display = 'none';
        $scope.configRulesBoxUI.display = 'none';
        $scope.ruleName = null;
        $scope.remarks = null;
        $scope.setId = null;
        $scope.addRuleBtnSpan = null;
        $scope.focusRuleName();
    };
    $scope.createAndSetRule = function () {
        if($scope.ruleName){
            if($scope.ruleName.length <= 10){
                $scope.createRuleData.name = $scope.ruleName;
                $scope.createRuleData.remarks = $scope.remarks;
                if($scope.setId){
                    rule.setRule($scope.setId,$scope.createRuleData,function (res) {
                        if(res.data.message == 'SUCCESS'){
                            $scope.closeConfigRulesBox();
                            $scope.update($rootScope.currentPage,$scope.pageSize);
                        }else{
                            $scope.errorUI.display = 'inline-block';
                            $scope.error = '规则名已存在，请重新输入';
                        }
                    });
                }else{
                    rule.createRule($scope.createRuleData,function (res) {
                        if(res.data.message == 'SUCCESS'){
                            $scope.closeConfigRulesBox();
                            $scope.update(1,$scope.pageSize);
                        }else{
                            $scope.errorUI.display = 'inline-block';
                            $scope.error = '规则名已存在，请重新输入';
                        }
                    });
                }
            }else{
                $scope.errorUI.display = 'inline-block';
                $scope.error = '规则名长度不能超过10';
            }
        }else{
            $scope.errorUI.display = 'inline-block';
            $scope.error = '规则名不能为空';
        }
    };
    $scope.focusRuleName = function () {
        $scope.errorUI.display = 'none';
        $scope.error = null;
    };
    //删除已有规则
    $scope.deleteRule = function () {
        rule.deleteRule($rootScope.deleteId,function (res) {
            if(res.data.message == 'SUCCESS'){
                $scope.update($rootScope.currentPage,$scope.pageSize);
                $rootScope.closeDeleteBox();
            }
        });
    };
    //进入detail
    $scope.detailIndexArr = [];
    for(var i=0; i<$scope.pageSize; i++){
        $scope.detailIndexArr.push(false);
    }
    $scope.isOpenClass = function (index) {
        return $scope.detailIndexArr[index] == false ? 'close' : 'open';
    };
    $scope.isOpenDetailBox = function (index) {
        return $scope.detailIndexArr[index] == false ? {display : 'none'} : {display : 'block'};
    };
    $scope.toggleDetail = function (index) {
        $scope.detailIndexArr[index] = $scope.detailIndexArr[index] == false ? true : false;
    };
}]);

app.controller('taskList_c', ['$scope', '$rootScope', 'task', 'upload', function ($scope, $rootScope, task, upload) {
    $rootScope.init();
    $rootScope.taskListNav = true;
    $scope.pageSize = 5;
    $scope.status = '';//任务状态
    $scope.policyType = '';//脱敏规则
    $scope.targetType = '';//装载目标
    $scope.searchContent = '';
    //获取任务列表status,policyType,targetType,page,size,callback
    $scope.update = function (current,size) {
        task.getTaskList($scope.status,$scope.policyType,$scope.targetType,$scope.searchContent,current,size,function (res,pageFun) {
            $rootScope.dataTaskList = res.data.data.content;
            $rootScope.currentPage = res.data.data.page;
            $rootScope.totalPage = res.data.data.totalPage;
            $rootScope.pageData = pageFun.initPage(res.data.data.page,res.data.data.totalPage,5);
        });
    };

    $scope.update(1,$scope.pageSize);
    //开始脱敏--启动--重新脱敏
    $scope.startTaskBtn = function (uuid) {
        task.startTask(uuid);
    };
    //暂停脱敏任务
    $scope.pauseTaskBtn = function (uuid) {
        task.pauseTask(uuid);
    };
    //取消脱敏任务
    $scope.cancelTaskBtn = function (uuid) {
        task.cancelTask(uuid);
    };
    //列表状态按钮显示
    $scope.btnUI = function (arg) {
        return arg && {display : 'block'}
    };
    //任务状态赛选
    $scope.allStatus = true;
    $scope.failStatus = false;
    $scope.cancelStatus = false;
    $scope.newStatus = false;
    $scope.onStatus = false;
    $scope.pauseStatus = false;
    $scope.successStatus = false;
    $scope.chooseStatus = function (arg) {
        $scope.allStatus = false;
        $scope.failStatus = false;
        $scope.cancelStatus = false;
        $scope.newStatus = false;
        $scope.onStatus = false;
        $scope.pauseStatus = false;
        $scope.successStatus = false;
        switch (arg){
            case '' : $scope.allStatus = true;break;
            case -2 : $scope.failStatus = true;break;
            case -1 : $scope.cancelStatus = true;break;
            case 0 : $scope.newStatus = true;break;
            case 1 : $scope.onStatus = true;break;
            case 2 : $scope.pauseStatus = true;break;
            case 3 : $scope.successStatus = true;break;
        }
        $scope.status = arg;
        $scope.update(1,$scope.pageSize);
    };
    //脱敏规则赛选
    $scope.allPolicyType = true;
    $scope.hasPolicyType = false;
    $scope.customPolicyType = false;
    $scope.choosePolicyType = function (arg) {
        $scope.allPolicyType = false;
        $scope.hasPolicyType = false;
        $scope.customPolicyType = false;
        switch (arg){
            case '' : $scope.allPolicyType = true;break;
            case 1 : $scope.customPolicyType = true;break;
            case 0 : $scope.hasPolicyType = true;break;
        }
        $scope.policyType = arg;
        $scope.update(1,$scope.pageSize);
    };
    //装载目标赛选
    $scope.allTargetType = true;
    $scope.fileTargetType = false;
    $scope.MySQLTargetType = false;
    $scope.OracleTargetType = false;
    $scope.DB2TargetType = false;
    $scope.IDSTargetType = false;
    $scope.SQLServerTargetType = false;
    $scope.SybaseTargetType = false;
    $scope.PostgreSQLTargetType = false;
    $scope.GreenPlunTargetType = false;
    $scope.TeraDataTargetType = false;
    $scope.chooseTargetType = function (arg) {
        $scope.allTargetType = false;
        $scope.fileTargetType = false;
        $scope.MySQLTargetType = false;
        $scope.OracleTargetType = false;
        $scope.DB2TargetType = false;
        $scope.IDSTargetType = false;
        $scope.SQLServerTargetType = false;
        $scope.SybaseTargetType = false;
        $scope.PostgreSQLTargetType = false;
        $scope.GreenPlunTargetType = false;
        $scope.TeraDataTargetType = false;
        switch (arg){
            case '' : $scope.allTargetType = true;break;
            case 'file' : $scope.fileTargetType = true;break;
            case 'MySQL' : $scope.MySQLTargetType = true;break;
            case 'Oracle' : $scope.OracleTargetType = true;break;
            case 'DB2' : $scope.DB2TargetType = true;break;
            case 'IDS' : $scope.IDSTargetType = true;break;
            case 'SQLServer' : $scope.SQLServerTargetType = true;break;
            case 'Sybase' : $scope.SybaseTargetType = true;break;
            case 'PostgreSQL' : $scope.PostgreSQLTargetType = true;break;
            case 'GreenPlun' : $scope.GreenPlunTargetType = true;break;
            case 'TeraData' : $scope.TeraDataTargetType = true;break;
        }
        $scope.targetType = arg;
        $scope.update(1,$scope.pageSize);
    };
    //文件下载
    $scope.fileDownload = function (uuid) {upload.fileDownload(uuid);};
}]);

app.controller('createTask_c', ['$scope', '$rootScope', 'upload', 'database', 'rule', 'task', '$routeParams', function ($scope, $rootScope, upload, database, rule, task, $routeParams) {
    $rootScope.init();
    $rootScope.createTaskNav = true;
    //创建任务提示框
    $scope.createTaskTipUI = {display : 'none'};
    //是否可以创建任务
    $scope.isCreateDisable = true;
    //是否可以下一步到装载目标页面
    $scope.isToChooseConfigDisable = false;
    //创建任务的所需数据对象
    $scope.createTaskObj = {
        policy : null,
        policyName : null,
        policyType : null,
        source : null,
        sourceFile : null,
        sourceType : null,
        target : null,
        targetFile : null,
        targetType : null
    };
    //配置数据源文件
    $scope.isFileSensitive = true;
    $scope.fileSensitiveUI = {display : 'block'};
    $scope.fileListUI = {display : 'none'};//文件信息
    $scope.isExcel = true;
    $scope.isCsv = false;
    $scope.isTxt = false;
    $scope.isFileDisable = true;
    $scope.fileType = 'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    $scope.toggleFileType = function (arg) {
        $scope.fileData = null;
        $scope.clearFileData();
        $scope.fileListUI.display = 'none';
        $scope.isFileDisable = true;
        $scope.isExcel = false;
        $scope.isCsv = false;
        $scope.isTxt = false;
        switch (arg){
            case 'excel' :
                $scope.isExcel = true;
                $scope.fileType = 'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
                break;
            case 'csv' :
                $scope.isCsv = true;
                $scope.fileType = '.csv';
                break;
            case 'txt' :
                $scope.fileType = '.txt';
                $scope.isTxt = true;
                break;
        }
    };
    $scope.fileSpan = function () {
        var str = '';
        $scope.isExcel == true && (str = 'EXCEL');
        $scope.isCsv == true && (str = 'CSV');
        $scope.isTxt == true && (str = 'TXT');
        return str;
    };
    $scope.$watch('fileData', function (newVal) {
        if(newVal){
            $scope.isFileDisable = false;
            $scope.fileName = newVal.name;
            $scope.fileSize = newVal.size;
            $scope.fileSuffix = newVal.name.slice(newVal.name.lastIndexOf('.')+1,newVal.name.length);
            $scope.fileListUI.display = 'block';
        }
    });
    //配置数据源数据库
    $scope.isDatabaseSensitive = false;
    $scope.dataBaseSensitiveUI = {display : 'none'};
    $scope.databaseUI = {display : 'none'};//测试及添加数据源数据库
    $scope.tableUI = {display : 'none'};//选择数据源数据库中需要脱敏的表
    //配置脱敏数据页面
    $scope.configSensitiveUI = {display : 'none'};
    //配置脱敏规则页面
    $scope.chooseRulesUI = {display : 'none'};
    $scope.hasRulesUI = {display : 'none'};//已有脱敏规则
    $scope.configRulesUI = {display : 'none'};//创建临时脱敏规则
    //配置脱敏装载目标页面
    $scope.chooseTargetUI = {display : 'none'};
    $scope.hasTargetUI = {display : 'none'};//已有目标库
    $scope.configDatabaseUI = {display : 'none'};//创建临时目标库
    $scope.testTableUI = {display : 'none'};//测试表名的UI显示
    $scope.CSVTargetUI = {display : 'none'};//文件为装载目标
    //脱敏任务完成页面
    $scope.createdUI = {display : 'none'};

    $scope.toFileSensitive = function () {
        if($scope.isFileSensitive == false){
            $routeParams.id && $routeParams.tableName && $routeParams.type && $rootScope.href('createTask');
            $scope.clearData();
            $scope.dataBaseSensitiveUI.display = 'none';
            $scope.configSensitiveUI.display = 'none';
            $scope.chooseRulesUI.display = 'none';
            $scope.chooseTargetUI.display = 'none';
            $scope.createdUI.display = 'none';

            $scope.fileSensitiveUI.display = 'block';
            $scope.isFileSensitive = true;
            $scope.isDatabaseSensitive = false;
            $scope.toggleFileType('excel');
        }
    };//切换到文件脱敏
    $scope.toDatabaseSensitive = function () {
        if($scope.isDatabaseSensitive == false){
            $scope.clearData();
            $scope.fileSensitiveUI.display = 'none';
            $scope.configSensitiveUI.display = 'none';
            $scope.chooseRulesUI.display = 'none';
            $scope.chooseTargetUI.display = 'none';
            $scope.createdUI.display = 'none';

            $scope.dataBaseSensitiveUI.display = 'block';
            $scope.databaseUI.display = 'block';
            $scope.tableUI.display = 'none';
            $scope.isFileSensitive = false;
            $scope.isDatabaseSensitive = true;
            $rootScope.hideTestTipBox();
            $scope.isFileDisable = false;
        }
    };//切换到数据库脱敏
    $scope.toDatabaseTable = function () {
        database.getAllTableList($scope.createObj,function (res) {
            $scope.tableList = res.data.data.tables;
            $scope.dataSourceTable = $scope.tableList[0];
            $scope.databaseUI.display = 'none';
            $scope.tableUI.display = 'block';
        });
    };//切换到数据源-表-->并且获取该数据库对应的所有表
    $scope.toDatabase = function () {
        $rootScope.hideTestTipBox();
        $scope.databaseUI.display = 'block';
        $scope.tableUI.display = 'none';
    };//从数据源-表切换到数据源数据库
    $scope.tableDropDownUI = {display : 'none'};//数据源表的下拉列表
    $scope.toggleTableDropDown = function () {
        $scope.tableDropDownUI.display = $scope.tableDropDownUI.display == 'none' ? 'block' : 'none';
    };//切换数据源表的下拉列表
    $scope.getDataSourceTable = function (arg) {
        $scope.dataSourceTable = arg;
        $scope.toggleTableDropDown();
    };//选择数据源数据库脱敏的表

    $scope.hasRules = true;
    $scope.configRules = false;
    $scope.toChooseRules = function () {
        if(!$scope.isFileDisable){
            $scope.fileSensitiveUI.display = 'none';
            $scope.dataBaseSensitiveUI.display = 'none';

            $scope.configSensitiveUI.display = 'block';
            $scope.chooseRulesUI.display = 'block';
            $scope.hasRules = true;
            $scope.configRules = false;
            $scope.hasRulesUI.display = 'block';
            $scope.configRulesUI.display = 'none';
            $scope.isToChooseConfigDisable = $scope.hasRulesUuid ? false : true;
        }
    };//切换到选择规则页面
    $scope.toHasRules = function () {
        if(!$scope.hasRules){
            $scope.hasRules = true;
            $scope.configRules = false;
            $scope.hasRulesUI.display = 'block';
            $scope.configRulesUI.display = 'none';
            $scope.isToChooseConfigDisable = $scope.hasRulesUuid ? false : true;
        }
    };
    $scope.toConfigRules = function () {
        if(!$scope.configRules){
            $scope.hasRules = false;
            $scope.configRules = true;
            $scope.hasRulesUI.display = 'none';
            $scope.configRulesUI.display = 'block';
            $scope.isToChooseConfigDisable = false;
        }
    };
    $scope.isBackToSourceDisable = false;
    $scope.backToSource = function () {
        if(!$scope.isBackToSourceDisable){
            if($scope.isFileSensitive){
                //返回到文件脱敏页面
                $scope.configSensitiveUI.display = 'none';
                $scope.fileSensitiveUI.display = 'block';
            }else{
                //返回到数据库脱敏页面
                $scope.configSensitiveUI.display = 'none';
                $scope.dataBaseSensitiveUI.display = 'block';
            }
        }
    };//返回到配置目标源页面

    $scope.hasTarget = true;
    $scope.configTarget = false;
    $scope.csvTarget = false;
    $scope.toChooseTarget = function () {
        if(!$scope.isToChooseConfigDisable){
            $scope.chooseRulesUI.display = 'none';
            $scope.chooseTargetUI.display = 'block';
            $scope.isCreateDisable = true;
            $scope.hasTarget = true;
            $scope.configTarget = false;
            $scope.csvTarget = false;
            $scope.hasTargetUI.display = 'block';
            $scope.configDatabaseUI.display = 'none';
            $scope.testTableUI.display = 'none';
            $scope.CSVTargetUI.display = 'none';

            //清空测试表名成功与否的显示问题
            $rootScope.testTipBoxUI.display = 'none';
        }
    };//切换到选择装载目标页面
    $scope.toHasTarget = function () {
        if(!$scope.hasTarget){
            $scope.hasTarget = true;
            $scope.configTarget = false;
            $scope.csvTarget = false;
            $scope.hasTargetUI.display = 'block';
            $scope.configDatabaseUI.display = 'none';
            $scope.testTableUI.display = 'none';
            $scope.CSVTargetUI.display = 'none';
            $scope.isCreateDisable = true;

            //清空测试表名成功与否的显示问题
            $rootScope.testTipBoxUI.display = 'none';
        }
    };//切换到已有目标库
    $scope.toConfigTarget = function () {
        if(!$scope.configTarget){
            $scope.hasTarget = false;
            $scope.configTarget = true;
            $scope.csvTarget = false;
            $scope.hasTargetUI.display = 'none';
            $scope.configDatabaseUI.display = 'block';
            $scope.testTableUI.display = 'none';
            $scope.CSVTargetUI.display = 'none';
            $scope.testTipBoxUI.display = 'none';
            $scope.isCreateDisable = true;

            //清空测试表名成功与否的显示问题
            $rootScope.testTipBoxUI.display = 'none';
        }
    };//切换到配置目标库
    $scope.backToConfigTarget = function () {
        $scope.configDatabaseUI.display = 'block';
        $scope.testTableUI.display = 'none';
        //清空测试表名成功与否的显示问题
        $rootScope.testTipBoxUI.display = 'none';
    };
    $scope.toCsvTarget = function () {
        if(!$scope.csvTarget){
            $scope.hasTarget = false;
            $scope.configTarget = false;
            $scope.csvTarget = true;
            $scope.hasTargetUI.display = 'none';
            $scope.configDatabaseUI.display = 'none';
            $scope.testTableUI.display = 'none';
            $scope.CSVTargetUI.display = 'block';
            $scope.isCreateDisable = false;
        }
    };//切换到CSV
    $scope.backToRules = function () {
        $scope.chooseRulesUI.display = 'block';
        $scope.chooseTargetUI.display = 'none';
    };//返回到选择规则页面


    //测试数据源数据库
    $scope.databaseIp = '10.0.0.219';
    $scope.databasePort = 3306;
    $scope.databaseUsername = 'root';
    $scope.databasePassword = 'admin';
    $scope.databaseName = 'test';
    $scope.databaseType = 'MySQL';
    $scope.toggleDatabaseType = function (arg) {
        $scope.databaseType = arg;
        $rootScope.hideTestTipBox();
    };
    $scope.testDatabase = function () {
        if(!$rootScope.isTestBtnDisable){
            $rootScope.isTestBtnDisable = true;
            $scope.createObj = {
                databaseName : $scope.databaseName,
                ip : $scope.databaseIp,
                password: $scope.databasePassword,
                port : parseInt($scope.databasePort),
                dbType : $scope.databaseType,
                username : $scope.databaseUsername
            };
            database.testDatabase($scope.createObj,$rootScope.successCallback,$rootScope.failCallback);
        }
    };

    //测试目标源数据库
    $scope.databaseTargetIp = '10.0.10.156';
    $scope.databaseTargetPort = 3306;
    $scope.databaseTargetUsername = 'root';
    $scope.databaseTargetPassword = 'admin';
    $scope.databaseTargetName = 'test';
    $scope.databaseTargetType = 'MySQL';
    $scope.toggleDatabaseTargetType = function (arg) {
        $scope.databaseTargetType = arg;
        $rootScope.hideTestTipBox();
    };
    $scope.testTargetDatabase = function () {
        if(!$rootScope.isTestBtnDisable){
            $rootScope.isTestBtnDisable = true;
            $scope.createTargetObj = {
                databaseName : $scope.databaseTargetName,
                ip : $scope.databaseTargetIp,
                password: $scope.databaseTargetPassword,
                port : parseInt($scope.databaseTargetPort),
                dbType : $scope.databaseTargetType,
                username : $scope.databaseTargetUsername
            };
            database.testDatabase($scope.createTargetObj,function (res) {
                $rootScope.isTestBtnDisable = false;
                if(res.data.message == 'SUCCESS'){
                    $scope.configDatabaseUI.display = 'none';
                    $scope.testTableUI.display = 'block';
                }else{
                    $rootScope.isSuccess = 'fail';
                    $rootScope.isSuccessSpan = res.data.error;
                    $rootScope.testTipBoxUI.display = 'block';
                }
            },$rootScope.failCallback);
        }
    };

    //获取已有规则列表
    $scope.updateHasRules = function (current,size) {
        rule.getRuleList(current,size,'',function (res) {
            $scope.hasRulesList = res.data.data.content;
            if(res.data.data.content){
                $scope.hasRulesUuid = $scope.hasRulesList[0].uuid;
                $scope.hasRulesName = $scope.hasRulesList[0].name;
            }
            //数据源快捷脱敏
            if($routeParams.id && $routeParams.tableName && $routeParams.type){
                $scope.isDatabaseSensitive = true;
                $scope.isFileSensitive = false;
                $scope.isBackToSourceDisable = true;

                $scope.fileSensitiveUI.display = 'none';
                $scope.dataBaseSensitiveUI.display = 'none';

                $scope.configSensitiveUI.display = 'block';
                $scope.chooseRulesUI.display = 'block';
                $scope.hasRules = true;
                $scope.configRules = false;
                $scope.hasRulesUI.display = 'block';
                $scope.configRulesUI.display = 'none';
                $scope.isToChooseConfigDisable = $scope.hasRulesUuid ? false : true;
            }
        });
    };
    $scope.updateHasRules(1,30);
    $scope.toggleHasRulesUuid = function (uuid,name) {
        $scope.hasRulesUuid = uuid;
        $scope.hasRulesName = name;
    };

    //获取算法列表
    $scope.createRuleData = {
        modes : [],
        name : '',
        remarks : '',
        temporary : false
    };
    $scope.updateAlgorithm = function (current,size) {
        rule.getAlgorithmList(current,size,function (res) {
            $scope.algorithmData = res.data.data.content;
            if($scope.algorithmData){
                angular.forEach($scope.algorithmData,function (data) {
                    $scope.createRuleData.modes.push(data.modes[0].uuid);
                });
            }
        });
    };
    $scope.updateAlgorithm(1,30);
    $scope.toggleAlgorithm = function (uuid,index) {
        $scope.createRuleData.modes[index] = uuid;
    };

    //获取目标源数据库列表
    $scope.pageSize = 5;
    $scope.targetDatabaseId = null;
    $scope.searchContent = '';
    $scope.updateTargetDatabase = function (current,size) {
        database.getDatabaseList('export',current,size,$scope.searchContent,function (res,pageFun) {
            $rootScope.updateData(res,pageFun);
            if($rootScope.dataList){
                $scope.targetDatabaseId = $rootScope.dataList[0].id;
                $scope.targetDatabaseType = $rootScope.dataList[0].dbType;
            }
        });
    };
    $scope.updateTargetDatabase(1,$scope.pageSize);
    $scope.toggleTargetDatabaseId = function (id,type) {
        $scope.targetDatabaseId = id;
        $scope.targetDatabaseType = type;
        $scope.hideTestTableTipBox();
    };

    //测试表名是否可用
    $scope.testTableName = function (tableName) {
        if(tableName){
            var testTableObj = {
                tableName : tableName
            };
            $scope.hasTarget && (testTableObj.id = $scope.targetDatabaseId);
            if($scope.configTarget){
                testTableObj.ip = $scope.databaseTargetIp;
                testTableObj.port = $scope.databaseTargetPort;
                testTableObj.dbType = $scope.databaseTargetType;
                testTableObj.username = $scope.databaseTargetUsername;
                testTableObj.password = $scope.databaseTargetPassword;
                testTableObj.databaseName = $scope.databaseTargetName;
            }
            database.testHadTableName(testTableObj,function (res) {
                $rootScope.testTipBoxUI.display = 'block';
                if(res.data.message == 'SUCCESS'){
                    $rootScope.isSuccess = 'success';
                    $rootScope.isSuccessSpan = '装载数据库表名可用';
                    $scope.isCreateDisable = false;
                }else{
                    $rootScope.isSuccess = 'fail';
                    $rootScope.isSuccessSpan = res.data.error;
                    $scope.isCreateDisable = true;
                }
            });
        }else{
            $rootScope.testTipBoxUI.display = 'block';
            $rootScope.isSuccess = 'fail';
            $rootScope.isSuccessSpan = '装载数据库表名不能为空';
        }
    };
    $scope.hideTestTableTipBox = function () {
        $rootScope.testTipBoxUI.display = 'none';
        $scope.isCreateDisable = true;
    };

    //--1、
    $scope.isFileOrDatabase = function () {
        if(!$scope.isCreateDisable){
            $scope.createTaskTipUI.display = 'block';
            $rootScope.maskUI.display = 'block';
            //判断是数据源为文件还是为数据库
            if($scope.isFileSensitive){
                upload.fileUpload($scope.fileData,function (res) {
                    $scope.createTaskObj.source = res.data.data.resourceId;
                    $scope.createTaskObj.sourceFile = $scope.fileName;
                    $scope.createTaskObj.sourceType = $scope.fileSuffix;
                    $scope.temporaryRule();
                });
            }else{
                //判断是常用数据源还是临时数据源
                if($routeParams.id && $routeParams.tableName && $routeParams.type){
                    $scope.createTaskObj.source = $routeParams.id;
                    $scope.createTaskObj.sourceFile = $routeParams.tableName;
                    $scope.createTaskObj.sourceType = $routeParams.type;
                    $scope.temporaryRule();
                }else{
                    $scope.createObj.sourceType = 'import';
                    $scope.createObj.temporary = true;
                    $scope.createObj.comment = '';//备注
                    database.addDatabase($scope.createObj,function (res) {
                        $scope.createTaskObj.source = res.data.data.resourceId;
                        $scope.createTaskObj.sourceFile = $scope.dataSourceTable;
                        $scope.createTaskObj.sourceType = $scope.databaseType;
                        $scope.temporaryRule();
                    });
                }
            }
        }
    };
    //--2、
    $scope.temporaryRule = function () {
        //判断脱敏规则是常用规则还是临时规则
        if($scope.hasRules){
            $scope.createTaskObj.policy = $scope.hasRulesUuid;
            $scope.createTaskObj.policyName = $scope.hasRulesName;
            $scope.createTaskObj.policyType = 0;
            $scope.commonOrTemporaryOrCsv();
        }else{
            $scope.createRuleData.name = 'temporary';
            $scope.createRuleData.remarks = '';
            $scope.createRuleData.temporary = true;
            rule.createRule($scope.createRuleData,function (res) {
                $scope.createTaskObj.policy = res.data.data.uuid;
                $scope.createTaskObj.policyName = 'temporary';
                $scope.createTaskObj.policyType = 1;
                $scope.commonOrTemporaryOrCsv();
            });
        }
    };
    //--3、
    $scope.commonOrTemporaryOrCsv = function () {
        //判断目标源是文件、常用数据库、临时数据库
        if($scope.hasTarget){
            $scope.createTaskObj.target = $scope.targetDatabaseId;
            $scope.createTaskObj.targetFile = $scope.testHasTableName;
            $scope.createTaskObj.targetType = $scope.targetDatabaseType;
            $scope.createSensitiveTask();
        }else if($scope.configTarget){
            $scope.createTargetObj.sourceType = 'export';
            $scope.createTargetObj.temporary = true;
            $scope.createTargetObj.comment = '';//备注
            database.addDatabase($scope.createTargetObj,function (res) {
                $scope.createTaskObj.target = res.data.data.resourceId;
                $scope.createTaskObj.targetFile = $scope.testConfigTableName;
                $scope.createTaskObj.targetType = $scope.databaseTargetType;
                $scope.createSensitiveTask();
            });
        }else{
            $scope.createTaskObj.target = 'ifuckyou';
            if($routeParams.id && $routeParams.tableName && $routeParams.type){
                $scope.createTaskObj.targetFile = $routeParams.tableName;
            }else{
                $scope.createTaskObj.targetFile = $scope.fileName ? $scope.fileName : $scope.dataSourceTable;
            }
            $scope.createTaskObj.targetType = 'csv';
            $scope.createSensitiveTask();
        }
    };
    //创建脱敏任务
    $scope.createSensitiveTask = function () {
        task.createTask($scope.createTaskObj,function (res) {
            $scope.createTaskTipUI.display = 'none';
            $rootScope.maskUI.display = 'none';
            $scope.createdId = res.data.data.uuid;
            $scope.createdUI.display = 'block';
            $scope.chooseTargetUI.display = 'none';
            $scope.clearData();
        });
    };
    //清除数据
    $scope.clearData = function () {
        //目标源文件清空
        $scope.fileData = null;
        $scope.clearFileData();
        //装载数据库表民清空
        $scope.testHasTableName = null;
        $scope.testConfigTableName = null;
        //规则回到最初状态
        if($scope.hasRulesList){
            $scope.hasRulesUuid = $scope.hasRulesList[0].uuid;
            $scope.hasRulesName = $scope.hasRulesList[0].name;
        }
        if($scope.algorithmData){
            $scope.createRuleData.modes = [];
            angular.forEach($scope.algorithmData,function (data) {
                $scope.createRuleData.modes.push(data.modes[0].uuid);
            });
        }
        //以后装载源回到初始状态
        $rootScope.dataList && $rootScope.togglePage($scope.updateTargetDatabase,1,$scope.pageSize);
        $scope.createTaskObj.policy = null;
        $scope.createTaskObj.policyName = null;
        $scope.createTaskObj.policyType = null;
        $scope.createTaskObj.source = null;
        $scope.createTaskObj.sourceFile = null;
        $scope.createTaskObj.sourceType = null;
        $scope.createTaskObj.target = null;
        $scope.createTaskObj.targetFile = null;
        $scope.createTaskObj.targetType = null;

        $scope.isBackToSourceDisable = false;
    };

    $scope.backToFileSensitive = function () {
        $scope.clearData();
        $scope.dataBaseSensitiveUI.display = 'none';
        $scope.configSensitiveUI.display = 'none';
        $scope.chooseRulesUI.display = 'none';
        $scope.chooseTargetUI.display = 'none';
        $scope.createdUI.display = 'none';

        $scope.fileSensitiveUI.display = 'block';
        $scope.isFileSensitive = true;
        $scope.isDatabaseSensitive = false;
        $scope.toggleFileType('excel');
    };
}]);

app.directive('clearFile', function () {
    return{
        link : function (scope,elem) {
            scope.clearFileData = function () {$(elem).val('');}
        }
    }
});

app.controller('log_c', ['$scope', '$http', '$rootScope', function ($scope, $http, $rootScope) {
    $rootScope.init();
    $rootScope.logNav = true;
}]);