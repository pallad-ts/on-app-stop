import {onAppStop, Signal} from "@src/index";
import * as sinon from 'sinon';

describe('onAppStop', () => {
    let listeners: Map<Signal, Array<(signal: Signal) => any>> = new Map();

    function dispatchForSignal(signal: Signal) {
        const funcs = listeners.get(signal);
        if (funcs) {
            funcs.forEach(x => x(signal));
        }
    }

    beforeEach(() => {
        sinon.stub(process, 'on')
            .callsFake((signal: any, func: any) => {
                if (!listeners.has(signal)) {
                    listeners.set(signal, []);
                }

                listeners.get(signal)!.push(func);

                return process;
            })
    });

    afterEach(() => {
        (process.on as any as sinon.SinonSpy).restore();
        listeners = new Map();
    });

    it('on SIGTERM', () => {
        const listener = sinon.stub();
        onAppStop(listener);

        dispatchForSignal('SIGTERM');

        sinon.assert.calledWith(listener, 'SIGTERM');
    });

    it('on SIGINT', () => {
        const listener = sinon.stub();
        onAppStop(listener);

        dispatchForSignal('SIGINT');

        sinon.assert.calledWith(listener, 'SIGINT');
    });
});