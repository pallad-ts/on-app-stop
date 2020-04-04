export function onAppStop(onStop: (signal: 'SIGTERM' | 'SIGINT') => any) {
    function createListener(signal: Signal) {
        return function () {
            return onStop(signal);
        }
    }

    (['SIGTERM', 'SIGINT'] as Signal[]).forEach(signal => {
        process.on(signal, createListener(signal));
    });
}

export type Signal = 'SIGINT' | 'SIGTERM';
