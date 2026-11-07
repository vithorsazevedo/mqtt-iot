const mqtt = require('mqtt')
const { timestamp } = require('node:console')

const client = mqtt.connect('mqtt://localhost:1884')

let cont1 = 0
let cont2 = 0
let cont3 = 0

client.on('connect', () => {
    console.log('Publicador conectado.')

    setInterval(() => {

        let estAlarme = Math.random() >= 0.5

        client.subscribe('iot/comandos', { qos: 1 })

        const sensor = {
            sequencia: ++cont1,
            dispositivo: 'sensor-01',
            temperatura: Number(20 + Math.random() * 15).toFixed(2),
            umidade: Math.floor(40 + Math.random() * 40),
            timestamp: new Date().toLocaleString()
        }

        const alarme01 = {
            sequencia: ++cont2,
            dispositivo: 'alarme-01',
            disparado: estAlarme,
            timestamp: new Date().toLocaleString()
        }

        const sensorluz = {
            sequencia: ++cont3,
            dispositivo: 'sensorluz-01',
            luminosidade: Number((Math.random() * 1000).toFixed(1)),
            timestamp: new Date().toLocaleString()
        }

        const payload = JSON.stringify(sensor)
        const payload2 = JSON.stringify(alarme01)
        const payload3 = JSON.stringify(sensorluz)

        client.publish(
            'iot/sensor/temperatura',
            payload,
            { qos: 1 },
            (erro) => {
                if (erro) {
                    console.error('Erro ao publicar temperatura:', erro)
                    return
                }

                console.log('Temperatura enviada:', payload)
            }
        )

        client.publish(
            'segurança/casa/alarme01',
            payload2,
            { qos: 1 },
            (erro) => {
                if (erro) {
                    console.error('Erro ao publicar alarme:', erro)
                    return
                }

                console.log('Alarme enviado:', payload2)
            }
        )

        client.publish(
            'curso/sensor/luminosidade',
            payload3,
            { qos: 1 },
            (erro) => {
                if (erro) {
                    console.error('Erro ao publicar luminosidade:', erro)
                    return
                }

                console.log('Luminosidade enviada:', payload3)
            }
        )

        console.log('Nova leitura')

    }, 10000)

})

client.on('message', (topico, mensagem) => {

    if (topico === 'iot/comandos') {

        const comando = mensagem.toString().toLowerCase().trim()

        console.log('Comando recebido:', comando)

        let resposta

        switch (comando) {

            case 'ligar':
                alarmeLigado = true
                resposta = 'Alarme ligado com sucesso!'
                break

            case 'desligar':
                alarmeLigado = false
                resposta = 'Alarme desligado com sucesso!'
                break

            case 'status':
                resposta = `Estado do alarme: ${alarmeLigado ? 'LIGADO' : 'DESLIGADO'}`
                break

            default:
                resposta = 'Comando inválido!'
        }

        console.log(resposta)

        client.publish('iot/respostas', resposta, { qos: 1 })
    }
})

client.on('error', (erro) => {
    console.log('Erro MQTT:', erro.message)
})

client.on('error', (erro) => {
    console.error('Erro MQTT:', erro.message)
})