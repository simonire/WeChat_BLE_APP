Page
({
    /**   * 页面的初始数据   */
    data: 
    {
        info: "未初始化蓝牙适配器",
        ConnectState: false,
        connectedDeviceId: "",
        deviceId: "",
        services: "",
        servicesUUID: "0003CDD0-0000-1000-8000-00805F9B0131",
        serviceId: "",
        notifyCharacteristicsId: "",
        writeCharacteristicsId: "",

        switch1State : false,
        switch2State : false,
        switch3State : false,
        
        times: "05:21",

    },







/*******  1 同步当前时间    *******/
    /*  开关触发事件    */
    switch1Change: function (e) {
        var that = this;
        console.log(`[ 同步当前时间 ] 发生change事件，携带值为`, e.detail.value)
        that.SyncThatTIME();
    }, 

    SyncThatTIME(event)
    {
        var that = this;

        wx.showLoading({
            title: '同步中...',
        });

        //this.SendMessageBLE();

        setTimeout(function () 
        {
            wx.hideLoading()
            wx.showToast({
                title: '同步成功',
                icon: 'success',
                duration: 800
            })
                        that.setData({info : ('其实我没有发数据哟~不要被动画欺骗了哟米娜桑!')})

            that.setData({switch1State: false})
        }, 2000)
    },
/*******  2 显示字符        *******/
    /*  开关触发事件    */
    switch2Change: function (e) 
    {
        var that = this;
        console.log(`[ 显示字符 ] 发生change事件，携带值为`, e.detail.value)
        that.SyncThatChar();
    },

    SyncThatChar(event)
    {
        var that = this;

        wx.showLoading({
            title: '同步中...',
        });

        //this.SendMessageBLE();

        setTimeout(function () {
            wx.hideLoading()
            wx.showToast({
                title: '同步成功',
                icon: 'success',
                duration: 800
            })
                        that.setData({ info: ('恭喜你发现了彩蛋，世界线+1') })

            that.setData({ switch2State: false })
        }, 2000)
    },
/*******  3 设定开关机时间    *******/
    /*  pick设定时间    */
    bindTimeChange: function (e) 
    {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData
        ({
            times: e.detail.value,
        })
    },

    /*  开关触发事件    */
    switch3Change: function (e) 
    {
        var that = this;
        console.log(`[ 设定开关机时间 ] 发生change事件，携带值为`, e.detail.value)
        that.SetOpenTime();
    },

    SetOpenTime(event)
    {
        var that = this;
        console.log(`设定时间为`, that.data.times)
        
        wx.showLoading
        ({
            title: '同步中...',
        });

        //this.SendMessageBLE();

        setTimeout(function () 
        {
            wx.hideLoading()
            wx.showToast
            ({
                title: '同步成功',
                icon: 'success',
                duration: 800
            })
            
                        that.setData({ info: ('你吼辣么大声干什么!') })

            that.setData({ switch3State: false })

        }, 2000)

    },

/*  页面生命周期函数    */
    onShow: function (options) {
        var that = this;

        wx.showLoading({
            title: '连接中...',
        });
        that.InitBLE()
    },

    InitBLE(event) 
    {
        var that = this;
        wx.openBluetoothAdapter
        ({
            success: function(res) 
            {
                console.log('初始化蓝牙适配器成功')
                that.GetBLE()
            },
            fail: function(res) 
            {
                console.log('请打开蓝牙和定位功能')
                wx.showToast
                ({
                    title: '请开启手机蓝牙',
                    icon: 'none',
                    duration: 1000
                })
            }
        })
    },

    GetBLE(event) 
    {
        var that = this;
        wx.getBluetoothAdapterState
        ({
            success: function(res) 
            { //打印相关信息        
                console.log("蓝牙是否可用：" + res.available );
                that.SearchBLE()
            },
            fail: function(res) 
            { //打印相关信息        
                console.log("蓝牙是否可用：" + res.available);
            }
        })
    },

    SearchBLE(event) 
    {
        var that = this;
        wx.startBluetoothDevicesDiscovery
        ({
            //services: ['0003CDD0-0000-1000-8000-00805F9B0131'], 
            //如果填写了此UUID，那么只会搜索出含有这个UUID的设备，建议一开始先不填写   
            allowDuplicatesKey: false,
            interval: 0,
            success: function(res) 
            {
                wx.showLoading
                ({
                    title: '正在搜索设备',
                })

                console.log('搜索设备返回完成')
                
                that.GetAllBLE()
            }
        })
    },

    GetAllBLE(event) 
    {
        var that = this;
        var HasDevice = false;
        wx.getBluetoothDevices
        ({
            success: function(res) 
            {
                //wx.hideLoading();

                console.log('搜设备数目：' + res.devices.length + '\n')

                if(res.devices.length == 0)
                {
                    wx.hideLoading();
                    wx.showToast
                    ({
                        title: '请重新扫描',
                        icon: 'loading',
                        //image: '../../images/dots.gif',
                        duration: 800
                    })
                }

                for (var i = 0; i < res.devices.length; i++) 
                {   
                    that.data.inputValue = "WH-BLE 103";
                    //：表示的是需要连接的蓝牙设备ID，
                    //简单点来说就是我想要连接这个蓝牙设备，所以我去遍历我搜索到的蓝牙设备中是否有这个ID
                    if (res.devices[i].name == that.data.inputValue || res.devices[i].localName == that.data.inputValue) 
                    { 
                        HasDevice = true;
                        that.BLEconnect(res.devices[i].deviceId);

                        console.log('设备信息：\n' + JSON.stringify(res.devices[i]) + "\n")
                        //that.lanyaconnect(res.devices[i].deviceId);//4.0
                        return;
                    }
                }

                if(!HasDevice)
                {
                    wx.hideLoading();
                    wx.showToast
                    ({
                        title: '请重新扫描',
                        //icon: 'fail',
                        //image: '../../images/dots.gif',
                        duration: 1000
                    })

                }
                
            }
        })
    },

    BLEconnect(deviceId) 
    {
        var that = this;
        wx.createBLEConnection
        ({
            deviceId: deviceId,
            success: function(res) 
            {
                wx.hideLoading();
                
                console.log('已连接BLE');
                
                that.setData
                ({
                    connectedDeviceId: deviceId,
                    //info: "MAC地址：" + deviceId +'\n'//+ '  调试信息：' + res.errMsg,
                })
                

                wx.showToast({
                    title: '连接成功',
                    icon: 'success',
                    duration: 800
                })

                that.StopBLE();
            },
            fail: function() 
            {
                console.log("连接失败");
            },
        })
    },


    StopBLE(event) 
    {
        var that = this;
        wx.stopBluetoothDevicesDiscovery
        ({
            success: function(res) 
            {
                console.log("停止搜索完成");
            
                that.StartBLEServices();
            }
        })
    },

    StartBLEServices(event) 
    {
        var that = this;
        wx.getBLEDeviceServices
        ({ // 这里的 deviceId 需要在上面的 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取      
            deviceId: that.data.connectedDeviceId,
            success: function(res) 
            {
                console.log('services UUID:\n', JSON.stringify(res.services));

                that.GetBLEDevice();
            }
        })
    },


    GetBLEDevice(event) 
    {
        var that = this;
        var myUUID = that.data.servicesUUID; //具有读、写、通知、属性的服务uuid    
        //console.log('UUID = ' + myUUID)
        wx.getBLEDeviceCharacteristics
        ({
            // 这里的 deviceId 需要在上面的 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取      
            deviceId: that.data.connectedDeviceId, // 这里的 serviceId 需要在上面的 getBLEDeviceServices 接口中获取      
            serviceId: myUUID,

            success: function(res) 
            {
                console.log("%c getBLEDeviceCharacteristics", "color:red;");
                for (var i = 0; i < res.characteristics.length; i++) 
                {
                    //console.log('特征值：' + res.characteristics[i].uuid)
                    if (res.characteristics[i].properties.notify) 
                    {
                        console.log("[打印 notifyServicweId] = ", myUUID);
                        //console.log("notifyCharacteristicsId：", res.characteristics[i].uuid);
                        that.setData
                        ({
                            notifyServicweId: myUUID,
                            notifyCharacteristicsId: "0003CDD1-0000-1000-8000-00805F9B0131",
                            //手动设置notifyCharacteristicsId为这个UUID，为了方便写死在这里             
                        })
                        
                        console.log("[ 打印 notifyCharacteristicsId ] = " + that.data.notifyCharacteristicsId)

                        that.StartNotice();
                    }
                    if (res.characteristics[i].properties.write) 
                    {
                        //console.log("writeServicweId：", myUUID);
                        //console.log("writeCharacteristicsId：", res.characteristics[i].uuid);
                        
                        that.setData
                        ({
                            writeServicweId: myUUID, //writeCharacteristicsId: res.characteristics[i].uuid,    
                            writeCharacteristicsId: "0003CDD2-0000-1000-8000-00805F9B0131",
                            //手动设置writeCharacteristicsId为这个UUID，为了方便写死在这里          
                        })
                    }
                }
                //console.log('device getBLEDeviceCharacteristics:', res.characteristics);
                that.setData
                ({
                    msg: JSON.stringify(res.characteristics),
                })
            },
            fail: function() 
            {
                console.log("fail");
            },
        })
    },

    StartNotice(event) 
    {
        var that = this;
        var notifyServicweId = that.data.servicesUUID; //具有写、通知属性的服务uuid    
        var notifyCharacteristicsId = that.data.notifyCharacteristicsId;
        
        console.log("[ 启用notify的serviceId ] = ", notifyServicweId);
        console.log("[ 启用notify的notifyCharacteristicsId ] = ", notifyCharacteristicsId);
        
        wx.notifyBLECharacteristicValueChange
        ({
            state: true, // 启用 notify 功能      
            deviceId: that.data.connectedDeviceId, // 这里的 serviceId 就是that.data.servicesUUID      
            serviceId: notifyServicweId,
            characteristicId: that.data.notifyCharacteristicsId,
            success: function(res) 
            {
                
                console.log('连接', res.errMsg) 
                
                var msg = '连接成功' 
                
                that.setData
                ({
                    
                    info: msg,
                    ConnectState : true
                })
            },
            fail: function() 
            {
                console.log('启动notify:' + res.errMsg);
            },
        })
    }



})