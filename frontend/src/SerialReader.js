export class SerialReader{
    constructor(){
        this.encoder = new TextEncoder()
        this.decoder = new TextDecoder()
    }
    async init(){
        if ('serial' in navigator) {
            try {
                const port = await navigator.serial.requestPort();
                await port.open({ baudRate: 230400 });
                this.reader = port.readable.getReader();
                let signals = await port.getSignals();
                console.log(signals);
            }
            catch (err) {
                console.error('There was an error opening the serial port:', err);
            }
        }
        else {
            console.error('Web serial doesn\'t seem to be enabled in your browser. Try enabling it by visiting:');
            console.error('chrome://flags/#enable-experimental-web-platform-features');
            console.error('opera://flags/#enable-experimental-web-platform-features');
            console.error('edge://flags/#enable-experimental-web-platform-features');
        }
    }
    async read() {
        console.log(1)
        try {
            const readerData = await this.reader.read();
            // let result = this.decoder.decode(readerData.value);
            console.log(readerData)
        }
        catch (err) {
            const errorMessage = `error reading data: ${err}`;
            console.error(errorMessage);
            return errorMessage;
        }
    }
}