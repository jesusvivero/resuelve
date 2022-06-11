# API para cálculo de sueldo de jugadores

Este aplicativo o API permite calcular el sueldo de un jugador de fútbol sumando el sueldo fijo y una bonificación determinada por condiciones como el nivel de desempeño, rendimiento personal y por equipo.
El API recibe y retorna un JSON con determinadas estructuras y la información calculada.


## Instalación

***Nota: Para su instalación se requiere tener un equipo que cuente con NodeJS (Este proyecto fue desarrollado sobre la versión v16.15.0).***

1. Clonar el repositorio.

`$ git clone url`

2. Ubicarse dentro del directorio donde está ubicado el archivo 'package.json'.

3. Instalar dependencias

`npm install`

## Configuración

1. Crear el archivo '.env' dentro del directorio principal con las variables de entorno definidas para nuestra aplicación:

###### Host donde se ejecuta nuestra API, por ejemplo:
`SERVER_HOST=localhost`

###### Puerto por donde se ejecuta nuestra API, por ejemplo
`SERVER_PORT=4000`

2. Configurar el archivo `teams-levels-conf.json` que se encuentra en '.../src/data/', en el se definen los equipos y niveles por defecto (Que se usan en caso de que no se definan en el json que recibe nuestra API)

**_Se debe respetar la siguiente estructura, de lo contrario la aplicación mostrará un mensaje indicando que no pudo cargar el archivo._**

```
{
  "equipos": [
    {
      "nombre": "String",
      "niveles": [
        {
          "nivel": "String",
          "goles": Integer >= 0
        },
        ...
      ]
    },
    ...
  ]
}
```

A continuación se muestra un ejemplo:

```
{
  "equipos": [
    {
      "nombre": "Las Aguilas",
      "niveles": [
        {
          "nivel": "A",
          "goles": 6
        },
        {
          "nivel": "B",
          "goles": 11
        },
        {
          "nivel": "C",
          "goles": 16
        },
        {
          "nivel": "Cuauh",
          "goles": 21
        }
      ]
    },
    {
      "nombre": "Sporting FC",
      "niveles": [
        {
          "nivel": "N1",
          "goles": 10
        },
        {
          "nivel": "N2",
          "goles": 20
        },
        {
          "nivel": "PRO",
          "goles": 30
        }
      ]
    }
  ]
}
```

## Cómo se inicia la aplicación

1. Ubicarse dentro del directorio raiz.

2. Iniciar la ejecución del proyecto

`npm run prod`

## Cómo se usa

A través del frontend o una aplicación Rest Client como Postman se envia contenido JSON mediante peticiones POST

#### Entrada
En headers `Content-Type: application/json` y en body se envía el JSON con la estructura apropiada según el tipo de cálculo que se requere realizar:

- URL API Cálculo de sueldos por listado de jugadores:
`http://localhost:5500/api/calculate/players/`

La estructura del JSON:

***La propiedad "equipos" es opcional, si el JSON no contiene esta propiedad el API trabajará con los equipos y niveles configurados previamente en 'teams-levels-conf.json'***
```
{
  "equipos":[
    {
      "nombre": "String",
      "niveles": [
        {
          "nivel": "String",
          "goles": Integer >= 0
        },
        ...
      ]
    },
    ...
  ],
  "jugadores" : [
    {
      "nombre":"String",
      "nivel":"String",
      "goles":Integer >= 0,
      "sueldo":Float >= 0,
      "bono":Float >= 0,
      "sueldo_completo":null,
      "equipo":"String"
    },
    ...
  ]
}
```

Ejemplo:

```
{
   "equipos":[
     {
       "nombre": "Las Aguilas",
       "niveles": [
         {
           "nivel": "A",
           "goles": 6
         },
         {
           "nivel": "B",
           "goles": 11
         },
         {
           "nivel": "C",
           "goles": 16
         },
         {
           "nivel": "Cuauh",
           "goles": 21
         }
       ]
     }
   ],
   "jugadores" : [
      {
         "nombre":"John Wick",
         "nivel":"C",
         "goles":13,
         "sueldo":90000,
         "bono":25000,
         "sueldo_completo":null,
         "equipo":"Las Aguilas"
      },
      {
         "nombre":"Santiago Olsen",
         "nivel":"PRO",
         "goles":25,
         "sueldo":110000,
         "bono":32000,
         "sueldo_completo":null,
         "equipo":"Sporting FC"
      },
      {
         "nombre":"The Rocket Man",
         "nivel":"N1",
         "goles":3,
         "sueldo":19000,
         "bono":10000,
         "sueldo_completo":null,
         "equipo":"Sporting FC"
      },
      {
         "nombre":"Felipe Maradona",
         "nivel":"B",
         "goles":14,
         "sueldo":33000,
         "bono":16000,
         "sueldo_completo":null,
         "equipo":"Las Aguilas"
      },
      {
         "nombre":"Ramon Valdez",
         "nivel":"A",
         "goles":6,
         "sueldo":22000,
         "bono":10000,
         "sueldo_completo":null,
         "equipo":"Las Aguilas"
      },
      {
         "nombre":"Goku",
         "nivel":"N2",
         "goles":20,
         "sueldo":55000,
         "bono":35000,
         "sueldo_completo":null,
         "equipo":"Sporting FC"
      },
      {
         "nombre":"Ranma Saotome",
         "nivel":"N2",
         "goles":25,
         "sueldo":80000,
         "bono":38000,
         "sueldo_completo":null,
         "equipo":"Sporting FC"
      },
      {
         "nombre":"Jack Reacher",
         "nivel":"Cuauh",
         "goles":50,
         "sueldo":120000,
         "bono":40000,
         "sueldo_completo":null,
         "equipo":"Las Aguilas"
      }
   ]
}
```

- URL API Cálculo de sueldos por listado de equipos
`http://localhost:5500/api/calculate/teams/`

La estructura del JSON:

***La propiedad "niveles" dentro de "equipos" es opcional, si el JSON no contiene esta propiedad dentro de "equipos" el API trabajará con los equipos y niveles configurados previamente en 'teams-levels-conf.json'***
```
{
  "equipos":[
    {
      "nombre": "String",
      "niveles": [
        {
          "nivel": "String",
          "goles": Integer >= 0
        },
        ...
      ]
      "jugadores" : [
        {
          "nombre":"String",
          "nivel":"String",
          "goles":Integer >= 0,
          "sueldo":Float >= 0,
          "bono":Float >= 0,
          "sueldo_completo":null,
        },
        ...
      ]
    },
    ...
  ],
}
```

Ejemplo:

```
{
  "equipos": [
    {
      "nombre": "Las Aguilas",
      "niveles": [
        {
          "nivel": "A",
          "goles": 7
        },
        {
          "nivel": "B",
          "goles": 12
        },
        {
          "nivel": "C",
          "goles": 17
        },
        {
          "nivel": "Cuauh",
          "goles": 22
        }
      ],
      "jugadores" : [
        {
          "nombre":"John Wick",
          "nivel":"C",
          "goles":13,
          "sueldo":90000,
          "bono":25000,
          "sueldo_completo":null
        },
        {
          "nombre":"Felipe Maradona",
          "nivel":"B",
          "goles":14,
          "sueldo":33000,
          "bono":16000,
          "sueldo_completo":null
        },
        {
          "nombre":"Ramon Valdez",
          "nivel":"A",
          "goles":6,
          "sueldo":22000,
          "bono":10000,
          "sueldo_completo":null
        },
        {
          "nombre":"Jack Reacher",
          "nivel":"Cuauh",
          "goles":50,
          "sueldo":120000,
          "bono":40000,
          "sueldo_completo":null
        }
      ]
    },
    {
      "nombre": "Sporting FC",
      "jugadores" : [
        {
          "nombre":"Santiago Olsen",
          "nivel":"PRO",
          "goles":25,
          "sueldo":110000,
          "bono":32000,
          "sueldo_completo":null
        },
        {
          "nombre":"The Rocket Man",
          "nivel":"N1",
          "goles":3,
          "sueldo":19000,
          "bono":10000,
          "sueldo_completo":null
        },
        {
          "nombre":"Goku",
          "nivel":"N2",
          "goles":20,
          "sueldo":55000,
          "bono":35000,
          "sueldo_completo":null
        },
        {
          "nombre":"Ranma Saotome",
          "nivel":"N2",
          "goles":25,
          "sueldo":80000,
          "bono":38000,
          "sueldo_completo":null
        }
      ]
    }
  ]
}
```

#### Salida
El API retornará un JSON con la información de los jugadores incluyendo el valor calculado de `sueldo_completo`, la estructura devuelta según el tipo de calculo solicitado:

- Para URL API `http://localhost:5500/api/calculate/players/` Cálculo de sueldos por listado de jugadores:
```
[
  {
    "nombre": "John Wick",
    "goles_minimos": 16,
    "goles": 13,
    "sueldo": 90000,
    "bono": 25000,
    "sueldo_completo": 112656.25,
    "equipo": "Las Aguilas"
  },
  {
    "nombre": "Santiago Olsen",
    "goles_minimos": 29,
    "goles": 25,
    "sueldo": 110000,
    "bono": 32000,
    "sueldo_completo": 139793.1,
    "equipo": "Sporting FC"
  },
  ...
]
```

- Para URL API `http://localhost:5500/api/calculate/teams/` Cálculo de sueldos por listado de equipos:
```
[
  {
    "nombre": "Dominoes",
    "jugadores": [
      {
        "nombre": "John Wick",
        "goles_minimos": 17,
        "goles": 13,
        "sueldo": 90000,
        "bono": 25000,
        "sueldo_completo": 112058.82
      },
      {
        "nombre": "Felipe Maradona",
        "goles_minimos": 12,
        "goles": 14,
        "sueldo": 33000,
        "bono": 16000,
        "sueldo_completo": 49000
      }
    ]
  },
  {
    "nombre": "Sporting FC",
    "jugadores": [
      {
        "nombre": "Santiago Olsen",
        "goles_minimos": 30,
        "goles": 25,
        "sueldo": 110000,
        "bono": 32000,
        "sueldo_completo": 139333.33
      },
      {
        "nombre": "The Rocket Man",
        "goles_minimos": 8,
        "goles": 3,
        "sueldo": 19000,
        "bono": 10000,
        "sueldo_completo": 25875
      }
    ]
  }
]
```
