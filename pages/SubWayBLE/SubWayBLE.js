// pages/SubWayBLE/SubWayBLE.js
Page({
    /**
     * 页面的初始数据
     */
    data: {
        connect: false,
        send_hex: false,
        send_string: true,
        send_string_val: 'Hex',
        recv_string: true,
        recv_string_val: 'Hex',
        recv_value: '',
        send_number: 0,
        recv_number: 0,
        recv_hex: true,
        wendu: 30,
        yanwu: 60
    },
    /*** 生命周期函数--监听页面加载 */
    onLoad: function (options) {
        wx.stopBluetoothDevicesDiscovery({
            success: function (res) {
                console.log('停止搜索设备', res)
            }
        })
        console.log(options);
        this.setData({
            deviceId: options.id,
            deviceName: options.name
        });
        console.log('设备的ID', this.data.deviceId);
    },
    /*** 生命周期函数--监听页面显示 */
    onShow: function () {
        wx.stopBluetoothDevicesDiscovery({
            success: function (res) {
                console.log('停止搜索设备', res)
            }
        })
        var that = this;
        /* 连接中动画 */
        wx.showLoading({
            title: '连接中...',
        });
        /* 开始连接蓝牙设备 */
        wx.createBLEConnection({
            deviceId: that.data.deviceId,
            success: function (res) {
                console.log('连接成功', res);
                wx.hideLoading();
                /* 获取设备的服务UUID */
                wx.getBLEDeviceServices({
                    deviceId: that.data.deviceId,
                    success: function (service) {
                        that.setData({
                            serviceId: "0000FFE0-0000-1000-8000-00805F9B34FB" //确定需要的服务UUID
                        });
                        console.log('需要的服务UUID', that.data.serviceId)
                        that.Characteristics(); //调用获取特征值函数
                    },
                });
                that.setData({
                    connect: true
                })
            },
        })
    },
    Characteristics: function () {
        var that = this;
        var device_characteristics = [];
        var characteristics_uuid = {};
        wx.getBLEDeviceCharacteristics({
            deviceId: that.data.deviceId,
            serviceId: that.data.serviceId,
            success: function (res) {
                var characteristics = res.characteristics; //获取到所有特征值
                var characteristics_length = characteristics.length; //获取到特征值数组的长度
                console.log('获取到特征值', characteristics);
                console.log('获取到特征值数组长度', characteristics_length);
                that.setData({
                    notycharacteristicsId: "0000FFE1-0000-1000-8000-00805F9B34FB", //需确定要的使能UUID
                    characteristicsId: "0000FFE1-0000-1000-8000-00805F9B34FB" //暂时确定的写入UUID
                });

                console.log('使能characteristicsId', that.data.notycharacteristicsId);
                console.log('写入characteristicsId', that.data.characteristicsId);
                that.notycharacteristicsId(); //使能事件
            },
        })
    },
    /* 使能函数 */
    notycharacteristicsId: function () {
        var that = this;
        var recv_value_ascii = "";
        var string_value = "";
        var recve_value = "";
        wx.notifyBLECharacteristicValueChange({
            deviceId: that.data.deviceId,
            serviceId: that.data.serviceId,
            characteristicId: that.data.notycharacteristicsId,
            state: true,
            success: function (res) {
                console.log('使能成功', res);
                /* 设备返回值 */
                wx.onBLECharacteristicValueChange(function (res) {
                    var length_hex = [];
                    var turn_back = "";
                    var result = res.value;
                    var hex = that.buf2hex(result);
                    console.log('返回的值', hex);
                    if (that.data.recv_string == true) {
                        /* 成功接收到的值的展示 */
                        that.setData({
                            recv_value: that.data.recv_value + hex
                        });
                        /* 接收成功的值的字节 */
                        var recv_number_1 = that.data.recv_number + hex.length / 2;
                        var recv_number = Math.round(recv_number_1);
                        that.setData({
                            recv_number: recv_number
                        });
                    } else {
                        console.log('设备返回来的值', hex);
                        var f_hex = hex;
                        var length_soy = f_hex.length / 2;
                        var length = Math.round(length_soy);
                        for (var i = 0; i < length; i++) {
                            var hex_spalit = f_hex.slice(0, 2);
                            length_hex.push(hex_spalit);
                            f_hex = f_hex.substring(2);
                        }
                        console.log('length_hex', length_hex);
                        for (var j = 0; j < length_hex.length; j++) {

                            var integar = length_hex[j]; //十六进制
                            recve_value = parseInt(integar, 16); //十进制
                            console.log('recve_value', recve_value);

                            turn_back = turn_back + String.fromCharCode(recve_value);
                            console.log('turn_back', turn_back);
                        }

                        console.log('最终转回来的值', turn_back)
                        var recv_number_1 = that.data.recv_number + turn_back.length;
                        var recv_number = Math.round(recv_number_1);
                        that.setData({
                            recv_number: recv_number,
                            recv_value: that.data.recv_value + turn_back
                        })
                    }
                });
            },
            fail: function (res) {
                console.log('使能失败', res);
            }
        })
    },
    /* 断开连接 */
    DisConnectTap: function () {
        var that = this;
        wx.closeBLEConnection({
            deviceId: that.data.deviceId,
            success: function (res) {
                console.log('断开设备连接', res);
                wx.reLaunch({
                    url: '../index/index',
                })
            }
        });
    },
    /*** 生命周期函数--监听页面卸载  */
    onUnload: function () {
        var that = this;
        wx.closeBLEConnection({
            deviceId: that.data.deviceId,
            success: function (res) {
                console.log('断开设备连接', res);
            }
        });
    },
    /* 清除Recv Bytes */
    CleanNumberRecv: function () {
        this.setData({
            recv_number: 0
        })
    },
    /* ArrayBuffer类型数据转为16进制字符串 */
    buf2hex: function (buffer) { // buffer is an ArrayBuffer
        var hexArr = Array.prototype.map.call(
            new Uint8Array(buffer),
            function (bit) {
                return ('00' + bit.toString(16)).slice(-2)
            }
        )
        return hexArr.join('');
    },
    switch1Change: function (e) {
        var that = this;
        let buffer = new ArrayBuffer(1)
        let dataView = new DataView(buffer)
        if (e.detail.value) {
            dataView.setUint8(0, 0)
        } else {
            dataView.setUint8(0, 1)
        }

        wx.writeBLECharacteristicValue({
            deviceId: that.data.deviceId,
            serviceId: that.data.serviceId,
            characteristicId: that.data.characteristicsId,
            value: buffer,
            success: function (res) {
                console.log('数据发送成功', res);
                console.log(buffer);
            },
            fail: function (res) {
                console.log('调用失败', res);
                /* 调用失败时，再次调用 */
                wx.writeBLECharacteristicValue({
                    deviceId: that.data.deviceId,
                    serviceId: that.data.serviceId,
                    characteristicId: that.data.characteristicsId,
                    value: buffer,
                    success: function (res) {
                        console.log('第2次数据发送成功', res);
                    }
                })
            }
        })
    },
    switch1Change1: function (e) {
        var that = this;
        let buffer = new ArrayBuffer(1)
        let dataView = new DataView(buffer)
        if (e.detail.value) {
            dataView.setUint8(0, 2)
        } else {
            dataView.setUint8(0, 3)
        }
        wx.writeBLECharacteristicValue({
            deviceId: that.data.deviceId,
            serviceId: that.data.serviceId,
            characteristicId: that.data.characteristicsId,
            value: buffer,
            success: function (res) {
                console.log('数据发送成功', res);
                console.log(buffer);
            },
            fail: function (res) {
                console.log('调用失败', res);
                /* 调用失败时，再次调用 */
                wx.writeBLECharacteristicValue({
                    deviceId: that.data.deviceId,
                    serviceId: that.data.serviceId,
                    characteristicId: that.data.characteristicsId,
                    value: buffer,
                    success: function (res) {
                        console.log('第2次数据发送成功', res);
                    }
                })
            }
        })
    },
    add: function (e) {
        var id = e.target.id;
        if (this.data[id] > 98) {
            wx.showToast({
                title: '已超过最大数值',
                icon: 'loading',
                duration: 2000
            })
            return;
        }
        this.setData({
            　　　　　　[id]: +this.data[id] + 1
        });
        this.numbers(id)
    },
    lessen: function (e) {
        var id = e.target.id;
        if (this.data[id] < 1) {
            wx.showToast({
                title: '已小于最小数值',
                icon: 'loading',
                duration: 2000
            })
            return;
        }
        this.setData({
            　　　　　　　[id]: +this.data[id] - 1
        });
        this.numbers(id)
    },
    changeVal: function (e) {
        var id = e.target.id;
        if (e.detail.value < 1 || e.detail.value > 100) {
            wx.showToast({
                title: '请输入有效数值',
                icon: 'loading',
                duration: 2000
            })
            return;
        }
        this.setData({
            　　　　　　[id]: e.detail.value
        });
        this.numbers(id)
    },
    numbers: function (id) {
        var that = this;
        var number = '9';
        let buffer = new ArrayBuffer(1)
        let dataView = new DataView(buffer)
        console.log(id)
        if (id == 'wendu') {
            number = '8' + that.data[id];
            dataView.setUint8(0, 8)
        } else {
            number = number + that.data[id];
            dataView.setUint8(0, number)
        }
        wx.writeBLECharacteristicValue({
            deviceId: that.data.deviceId,
            serviceId: that.data.serviceId,
            characteristicId: that.data.characteristicsId,
            value: buffer,
            success: function (res) {
                console.log('数据发送成功', res);
                console.log(buffer);
            }
        })
    }
})