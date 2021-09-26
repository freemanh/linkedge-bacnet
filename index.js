const bacnet = require('bacstack');
const {
    RESULT_SUCCESS,
    RESULT_FAILURE,
    ThingAccessClient,
    Config,
} = require('linkedge-thing-access-sdk');

const bacnetClient = new bacnet();

const callbacks = {
    setProperties: function (properties) {
        // Set properties to the physical thing and return the result.
        // Return an object representing the result or the promise wrapper of the object.

        return {
            code: RESULT_SUCCESS,
            message: 'success',
        }
    },

    getProperties: function () {
        // Get properties from the physical thing and return the result.
        // Return an object representing the result or the promise wrapper of the object.
        bacnetClient.readProperty('192.168.1.43', { type: bacnet.enum.ObjectType.ANALOG_INPUT, instance: 1 }
            , bacnet.enum.PropertyIdentifier.PRESENT_VALUE, (err, value) => {
                if (err) {
                    return {
                        code: RESULT_FAILURE,
                        message: err.message
                    }
                } else {
                    return {
                        code: RESULT_SUCCESS,
                        message: 'success',
                        params: {
                            ai1: value,
                        }
                    }
                }

            });


    },
    callService: function () {
        // Call services on the physical thing and return the result.
        // Return an object representing the result or the promise wrapper of the object.
        return new Promise((resolve) => {
            resolve({
                code: 0,
                message: 'success',
            })
        })
    }
}

Config.get()
    .then(config => {
        const thingInfos = config.getThingInfos();
        thingInfos.forEach(thingInfo => {
            const client = new ThingAccessClient(thingInfo, callbacks);
            client.registerAndOnline()
                .then(() => {
                    return new Promise(() => {
                        setInterval(() => {
                            client.reportProperties({ 'ai1': 41 });
                        }, 10000);
                    });
                })
                .catch(err => {
                    console.log(err);
                    client.cleanup();
                })
                .catch(err => {
                    console.log(err);
                });
        });
    });