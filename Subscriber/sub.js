const mqtt = require('mqtt')

const client = mqtt.connect('mqtt://localhost:1884', {
    reconnectPeriod: 2000,
    connectTimeout: 10000,
    clean: true
})

client.on('connect', () => {
    console.log('Conectado ao MQTT.')

    client.subscribe('iot/respostas', { qos: 1 }, (erro) => {
            if (erro) {
                console.log('Erro ao assinar respostas:', erro)
                return
            }

            console.log('Inscrito no tópico de respostas.')
    })

    client.subscribe(
        'iot/sensor/temperatura',
        { qos: 0 },
        (erro, concedidos) => {
            if (erro) {
                console.log('Erro ao assinar tópico:', erro)
                return
            }

            console.log('Assinatura realizada:', concedidos)
        })

    client.subscribe(
        'curso/sensor/luminosidade',
        { qos: 0 },
        (erro, concedidos) => {
            if (erro) {
                console.log('Erro ao assinar tópico:', erro)
                return
            }

            console.log('Assinatura realizada:', concedidos)
        })

    client.subscribe(
        'segurança/casa/alarme01',
        { qos: 0 },
        (erro, concedidos) => {
            if (erro) {
                console.log('Erro ao assinar tópico:', erro)
                return
            }

            console.log('Assinatura realizada:', concedidos)
        })
})

client.on('message', (topico, mensagem) => {
    console.log('Tópico:', topico)
    console.log('Mensagem:', mensagem.toString())
    console.log('--------------------')
})

client.on('error', (erro) => {
    console.log('Erro MQTT:', erro.message)
})

client.on('reconnect', () => {
    console.log('Tentando reconectar...')
})