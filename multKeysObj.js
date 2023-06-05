
class multKeysObj {
    constructor() {
        var that = this;

        this.console = function () {
            // console.log(...arguments);
        };
        this.registration = {};
        this.allKeysArr = [];
        this.keys = [];
        this.waterKeys = [];

        this.tokenJoining = '_';
        this.tokenSortFunction = (_a, _b) => {
            let a = String(_a),
                b = String(_b);
            if (a.length != b.length) {
                return a.length - b.length;
            } else {
                return a.localeCompare(b);
            }
        };
        this.tokenFn = (arr) => arr.sort(this.tokenSortFunction).join(this.tokenJoining);
        this.evKey = (ev) => {
            let result = ev.key.length == 1 || ev.key.toLowerCase() == 'dead' ?
                ev.code.toLowerCase().replace('key', '').replace('digit', '') :
                ev.key.toLowerCase();
            that.console(ev.type, ev, result);
            return result;
        };

        window.addEventListener('keydown', function (ev) {
            let k = that.evKey(ev);

            that.keys.push(k);
            that.keys = [...new Set(that.keys)];

            let hitKeys = that.keys.filter((key) => that.allKeysArr.includes(key)),
                hitToken = that.tokenFn(hitKeys);

            that.console('keydown', '\n\t',
                ev, k, '\n\t',
                hitKeys, hitToken, '\n\t',
                that);

            Object.entries(that.registration).map(o => {
                let [token, setting] = o;
                if (hitToken == token && (!that.waterKeys.includes(k))) {
                    setting.callback(that.keys, ev);
                    that.console('down', token, ' run callback ');
                    if (setting.fireBoolean == false) {
                        // that.keys = that.keys.filter(key => key != k);
                        that.waterKeys.push(k);
                        that.waterKeys = [...new Set(that.waterKeys)];
                        that.console('down, add ', k, ' to ', that.waterKeys, that);
                    }
                }
            });

        });

        window.addEventListener("keyup", function (ev) {

            let hitKeys_before = [...that.keys.filter((key) => that.allKeysArr.includes(key))],
                hitToken_before = String(that.tokenFn(hitKeys_before));

            let k = that.evKey(ev);
            that.keys = that.keys.filter((_k) => _k != k);

            let hitKeys_after = [...that.keys.filter((key) => that.allKeysArr.includes(key))],
                hitToken_after = String(that.tokenFn(hitKeys_after));

            that.console('keyup', '\n\t',
                ev, k, '\n\t',
                hitKeys_before, hitToken_before, '\n\t',
                hitKeys_after, hitToken_after, '\n\t',
                that);


            Object.entries(that.registration).map(o => {

                let [token, setting] = o;

                if (hitToken_before == token &&
                    hitKeys_before != hitToken_after
                ) {

                    if (typeof setting.releaseCallback === 'function') {
                        that.console('up', token, 'run release callback');
                        setting.releaseCallback(that.keys, ev);
                    }



                }

                if (setting.fireBoolean == false &&
                    that.waterKeys.includes(k) &&
                    setting.keysArr.includes(k)
                ) {
                    that.waterKeys = that.waterKeys.filter(key => key != k);
                    that.console('up, remove ', k, ' from ', that.waterKeys, that);
                }

            });
        });
    }
    register(keysArr, callback, releaseCallback = () => { }, fireBoolean = false) {
        keysArr = [...new Set(keysArr)];
        const keyToken = this.tokenFn(keysArr);
        this.allKeysArr.push(...keysArr);
        this.allKeysArr = [...new Set(this.allKeysArr)];

        this.registration[this.tokenFn(keysArr)] = {
            'keysArr': keysArr,
            'callback': callback,
            'releaseCallback': releaseCallback,
            'fireBoolean': fireBoolean
        };
    }
}

// const m = new multKeysObj();

// m.register(['alt', 's'],
//     () => {
//         pid = pidList['selfBuy'];
//         outputType = ["sLink"];
//         main();
//     },
//     () => {

//     },
//     false);

// m.register(['alt', 't'],
//     () => {
//         pid = pidList['for_bm_js'];
//         outputType = ["sLink"];
//         main();
//     },
//     () => {

//     },
//     false);

// m.register(['alt', 'c'],
//     () => {
//         const u = new URL(window.location.href);
//         window.location = u.origin + u.pathname + (u.search.indexOf('&') != -1 ? u.search.split('&').filter(i => Boolean(i.match(/[^a-zA-Z]id=/))).join('&') : u.search)
//     },
//     () => {

//     },
//     false);