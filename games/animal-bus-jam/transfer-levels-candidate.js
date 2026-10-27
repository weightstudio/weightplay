// Unexposed candidate only; not a release or play acceptance.
(function(root){
  const levels = [
  {
    "index": 30,
    "chapter": 6,
    "colors": 3,
    "par": 6,
    "baySize": 2,
    "buses": [
      {
        "color": 0,
        "seats": 2
      },
      {
        "color": 1,
        "seats": 2
      },
      {
        "color": 2,
        "seats": 2
      }
    ],
    "queues": [
      [
        2,
        1,
        0
      ],
      [
        0,
        2
      ],
      [
        1
      ]
    ],
    "transferGates": [],
    "transferPriority": [],
    "holdingTarget": 2,
    "solution": [
      {
        "type": "dispatch",
        "lane": 0
      },
      {
        "type": "dispatch",
        "lane": 0
      },
      {
        "type": "dispatch",
        "lane": 0
      },
      {
        "type": "dispatch",
        "lane": 1
      },
      {
        "type": "dispatch",
        "lane": 2
      },
      {
        "type": "swap"
      },
      {
        "type": "dispatch",
        "lane": 1
      }
    ]
  },
  {
    "index": 31,
    "chapter": 6,
    "colors": 3,
    "par": 6,
    "baySize": 2,
    "buses": [
      {
        "color": 1,
        "seats": 2
      },
      {
        "color": 2,
        "seats": 2
      },
      {
        "color": 0,
        "seats": 2
      }
    ],
    "queues": [
      [
        2
      ],
      [
        0,
        2,
        1
      ],
      [
        1,
        0
      ]
    ],
    "transferGates": [],
    "transferPriority": [],
    "holdingTarget": 2,
    "solution": [
      {
        "type": "dispatch",
        "lane": 1
      },
      {
        "type": "dispatch",
        "lane": 1
      },
      {
        "type": "dispatch",
        "lane": 1
      },
      {
        "type": "dispatch",
        "lane": 2
      },
      {
        "type": "dispatch",
        "lane": 0
      },
      {
        "type": "swap"
      },
      {
        "type": "dispatch",
        "lane": 2
      }
    ]
  },
  {
    "index": 32,
    "chapter": 6,
    "colors": 3,
    "par": 6,
    "baySize": 2,
    "buses": [
      {
        "color": 2,
        "seats": 2
      },
      {
        "color": 0,
        "seats": 2
      },
      {
        "color": 1,
        "seats": 2
      }
    ],
    "queues": [
      [
        0,
        0,
        1
      ],
      [
        2
      ],
      [
        1,
        2
      ]
    ],
    "transferGates": [],
    "transferPriority": [],
    "holdingTarget": 1,
    "solution": [
      {
        "type": "dispatch",
        "lane": 1
      },
      {
        "type": "dispatch",
        "lane": 2
      },
      {
        "type": "dispatch",
        "lane": 2
      },
      {
        "type": "dispatch",
        "lane": 0
      },
      {
        "type": "dispatch",
        "lane": 0
      },
      {
        "type": "dispatch",
        "lane": 0
      }
    ]
  },
  {
    "index": 33,
    "chapter": 6,
    "colors": 3,
    "par": 6,
    "baySize": 2,
    "buses": [
      {
        "color": 0,
        "seats": 2
      },
      {
        "color": 2,
        "seats": 2
      },
      {
        "color": 1,
        "seats": 2
      }
    ],
    "queues": [
      [
        0
      ],
      [
        1
      ],
      [
        1,
        2,
        0
      ],
      [
        2
      ]
    ],
    "transferGates": [],
    "transferPriority": [],
    "holdingTarget": 2,
    "solution": [
      {
        "type": "dispatch",
        "lane": 0
      },
      {
        "type": "dispatch",
        "lane": 2
      },
      {
        "type": "dispatch",
        "lane": 2
      },
      {
        "type": "dispatch",
        "lane": 2
      },
      {
        "type": "dispatch",
        "lane": 3
      },
      {
        "type": "swap"
      },
      {
        "type": "dispatch",
        "lane": 1
      }
    ]
  },
  {
    "index": 34,
    "chapter": 6,
    "colors": 3,
    "par": 8,
    "baySize": 2,
    "buses": [
      {
        "color": 1,
        "seats": 2
      },
      {
        "color": 0,
        "seats": 2
      },
      {
        "color": 2,
        "seats": 2
      },
      {
        "color": 1,
        "seats": 2
      }
    ],
    "queues": [
      [
        2,
        0,
        1,
        1,
        1
      ],
      [
        0
      ],
      [
        2
      ],
      [
        1
      ]
    ],
    "transferGates": [],
    "transferPriority": [],
    "holdingTarget": 2,
    "solution": [
      {
        "type": "dispatch",
        "lane": 0
      },
      {
        "type": "dispatch",
        "lane": 0
      },
      {
        "type": "dispatch",
        "lane": 0
      },
      {
        "type": "dispatch",
        "lane": 0
      },
      {
        "type": "dispatch",
        "lane": 1
      },
      {
        "type": "swap"
      },
      {
        "type": "dispatch",
        "lane": 2
      },
      {
        "type": "dispatch",
        "lane": 0
      },
      {
        "type": "dispatch",
        "lane": 3
      }
    ]
  },
  {
    "index": 35,
    "chapter": 7,
    "colors": 3,
    "par": 6,
    "baySize": 2,
    "buses": [
      {
        "color": 0,
        "seats": 2
      },
      {
        "color": 1,
        "seats": 2
      },
      {
        "color": 2,
        "seats": 2
      }
    ],
    "queues": [
      [
        2,
        0
      ],
      [
        1,
        0
      ],
      [
        1
      ],
      [
        2
      ]
    ],
    "transferGates": [
      {
        "lane": 2,
        "unlockAfter": 1
      }
    ],
    "transferPriority": [],
    "holdingTarget": 2,
    "solution": [
      {
        "type": "dispatch",
        "lane": 0
      },
      {
        "type": "dispatch",
        "lane": 0
      },
      {
        "type": "dispatch",
        "lane": 1
      },
      {
        "type": "dispatch",
        "lane": 1
      },
      {
        "type": "dispatch",
        "lane": 2
      },
      {
        "type": "swap"
      },
      {
        "type": "dispatch",
        "lane": 3
      }
    ]
  },
  {
    "index": 36,
    "chapter": 7,
    "colors": 3,
    "par": 6,
    "baySize": 2,
    "buses": [
      {
        "color": 1,
        "seats": 2
      },
      {
        "color": 0,
        "seats": 2
      },
      {
        "color": 2,
        "seats": 2
      }
    ],
    "queues": [
      [
        1
      ],
      [
        2,
        0,
        1
      ],
      [
        0
      ],
      [
        2
      ]
    ],
    "transferGates": [
      {
        "lane": 3,
        "unlockAfter": 1
      }
    ],
    "transferPriority": [],
    "holdingTarget": 2,
    "solution": [
      {
        "type": "dispatch",
        "lane": 0
      },
      {
        "type": "dispatch",
        "lane": 1
      },
      {
        "type": "dispatch",
        "lane": 1
      },
      {
        "type": "dispatch",
        "lane": 1
      },
      {
        "type": "dispatch",
        "lane": 2
      },
      {
        "type": "swap"
      },
      {
        "type": "dispatch",
        "lane": 3
      }
    ]
  },
  {
    "index": 37,
    "chapter": 7,
    "colors": 3,
    "par": 8,
    "baySize": 2,
    "buses": [
      {
        "color": 2,
        "seats": 2
      },
      {
        "color": 1,
        "seats": 2
      },
      {
        "color": 0,
        "seats": 2
      },
      {
        "color": 2,
        "seats": 2
      }
    ],
    "queues": [
      [
        0
      ],
      [
        0,
        2,
        1,
        2
      ],
      [
        1
      ],
      [
        2,
        2
      ]
    ],
    "transferGates": [
      {
        "lane": 3,
        "unlockAfter": 3
      }
    ],
    "transferPriority": [],
    "holdingTarget": 2,
    "solution": [
      {
        "type": "dispatch",
        "lane": 1
      },
      {
        "type": "dispatch",
        "lane": 1
      },
      {
        "type": "dispatch",
        "lane": 1
      },
      {
        "type": "dispatch",
        "lane": 1
      },
      {
        "type": "dispatch",
        "lane": 2
      },
      {
        "type": "swap"
      },
      {
        "type": "dispatch",
        "lane": 0
      },
      {
        "type": "dispatch",
        "lane": 3
      },
      {
        "type": "dispatch",
        "lane": 3
      }
    ]
  },
  {
    "index": 38,
    "chapter": 7,
    "colors": 3,
    "par": 6,
    "baySize": 2,
    "buses": [
      {
        "color": 0,
        "seats": 2
      },
      {
        "color": 2,
        "seats": 2
      },
      {
        "color": 1,
        "seats": 2
      }
    ],
    "queues": [
      [
        1,
        2,
        0
      ],
      [
        0
      ],
      [
        1
      ],
      [
        2
      ]
    ],
    "transferGates": [
      {
        "lane": 2,
        "unlockAfter": 1
      }
    ],
    "transferPriority": [],
    "holdingTarget": 2,
    "solution": [
      {
        "type": "dispatch",
        "lane": 0
      },
      {
        "type": "dispatch",
        "lane": 0
      },
      {
        "type": "dispatch",
        "lane": 0
      },
      {
        "type": "dispatch",
        "lane": 1
      },
      {
        "type": "dispatch",
        "lane": 3
      },
      {
        "type": "swap"
      },
      {
        "type": "dispatch",
        "lane": 2
      }
    ]
  },
  {
    "index": 39,
    "chapter": 7,
    "colors": 3,
    "par": 8,
    "baySize": 2,
    "buses": [
      {
        "color": 1,
        "seats": 2
      },
      {
        "color": 2,
        "seats": 2
      },
      {
        "color": 0,
        "seats": 2
      },
      {
        "color": 1,
        "seats": 2
      }
    ],
    "queues": [
      [
        0,
        1
      ],
      [
        1,
        0,
        2
      ],
      [
        1,
        1
      ],
      [
        2
      ]
    ],
    "transferGates": [
      {
        "lane": 1,
        "unlockAfter": 1
      },
      {
        "lane": 0,
        "unlockAfter": 2
      }
    ],
    "transferPriority": [],
    "holdingTarget": 2,
    "solution": [
      {
        "type": "dispatch",
        "lane": 2
      },
      {
        "type": "dispatch",
        "lane": 2
      },
      {
        "type": "dispatch",
        "lane": 1
      },
      {
        "type": "dispatch",
        "lane": 1
      },
      {
        "type": "dispatch",
        "lane": 1
      },
      {
        "type": "dispatch",
        "lane": 3
      },
      {
        "type": "dispatch",
        "lane": 0
      },
      {
        "type": "swap"
      },
      {
        "type": "dispatch",
        "lane": 0
      }
    ]
  },
  {
    "index": 40,
    "chapter": 8,
    "colors": 3,
    "par": 6,
    "baySize": 2,
    "buses": [
      {
        "color": 0,
        "seats": 2
      },
      {
        "color": 1,
        "seats": 2
      },
      {
        "color": 2,
        "seats": 2
      }
    ],
    "queues": [
      [
        2,
        1,
        0
      ],
      [
        1
      ],
      [
        0
      ],
      [
        2
      ]
    ],
    "transferGates": [
      {
        "lane": 3,
        "unlockAfter": 1
      }
    ],
    "transferPriority": [
      {
        "lane": 1,
        "position": 0
      }
    ],
    "holdingTarget": 2,
    "solution": [
      {
        "type": "dispatch",
        "lane": 0
      },
      {
        "type": "dispatch",
        "lane": 0
      },
      {
        "type": "dispatch",
        "lane": 0
      },
      {
        "type": "dispatch",
        "lane": 2
      },
      {
        "type": "dispatch",
        "lane": 1
      },
      {
        "type": "swap"
      },
      {
        "type": "dispatch",
        "lane": 3
      }
    ]
  },
  {
    "index": 41,
    "chapter": 8,
    "colors": 3,
    "par": 6,
    "baySize": 2,
    "buses": [
      {
        "color": 2,
        "seats": 2
      },
      {
        "color": 0,
        "seats": 2
      },
      {
        "color": 1,
        "seats": 2
      }
    ],
    "queues": [
      [
        1
      ],
      [
        2
      ],
      [
        0
      ],
      [
        1,
        0,
        2
      ]
    ],
    "transferGates": [
      {
        "lane": 0,
        "unlockAfter": 1
      }
    ],
    "transferPriority": [
      {
        "lane": 2,
        "position": 0
      }
    ],
    "holdingTarget": 2,
    "solution": [
      {
        "type": "dispatch",
        "lane": 1
      },
      {
        "type": "dispatch",
        "lane": 3
      },
      {
        "type": "dispatch",
        "lane": 3
      },
      {
        "type": "dispatch",
        "lane": 3
      },
      {
        "type": "dispatch",
        "lane": 2
      },
      {
        "type": "swap"
      },
      {
        "type": "dispatch",
        "lane": 0
      }
    ]
  },
  {
    "index": 42,
    "chapter": 8,
    "colors": 3,
    "par": 8,
    "baySize": 2,
    "buses": [
      {
        "color": 1,
        "seats": 2
      },
      {
        "color": 2,
        "seats": 2
      },
      {
        "color": 0,
        "seats": 2
      },
      {
        "color": 1,
        "seats": 2
      }
    ],
    "queues": [
      [
        1,
        1
      ],
      [
        1,
        0
      ],
      [
        0,
        2
      ],
      [
        2,
        1
      ]
    ],
    "transferGates": [
      {
        "lane": 0,
        "unlockAfter": 1
      }
    ],
    "transferPriority": [
      {
        "lane": 2,
        "position": 1
      },
      {
        "lane": 0,
        "position": 0
      }
    ],
    "holdingTarget": 2,
    "solution": [
      {
        "type": "dispatch",
        "lane": 1
      },
      {
        "type": "dispatch",
        "lane": 2
      },
      {
        "type": "dispatch",
        "lane": 3
      },
      {
        "type": "dispatch",
        "lane": 3
      },
      {
        "type": "dispatch",
        "lane": 2
      },
      {
        "type": "swap"
      },
      {
        "type": "dispatch",
        "lane": 1
      },
      {
        "type": "dispatch",
        "lane": 0
      },
      {
        "type": "dispatch",
        "lane": 0
      }
    ]
  },
  {
    "index": 43,
    "chapter": 8,
    "colors": 4,
    "par": 8,
    "baySize": 2,
    "buses": [
      {
        "color": 0,
        "seats": 2
      },
      {
        "color": 1,
        "seats": 2
      },
      {
        "color": 3,
        "seats": 2
      },
      {
        "color": 2,
        "seats": 2
      }
    ],
    "queues": [
      [
        0,
        0
      ],
      [
        1
      ],
      [
        2,
        3
      ],
      [
        3,
        1,
        2
      ]
    ],
    "transferGates": [
      {
        "lane": 2,
        "unlockAfter": 1
      }
    ],
    "transferPriority": [
      {
        "lane": 2,
        "position": 1
      }
    ],
    "holdingTarget": 2,
    "solution": [
      {
        "type": "dispatch",
        "lane": 0
      },
      {
        "type": "dispatch",
        "lane": 0
      },
      {
        "type": "dispatch",
        "lane": 1
      },
      {
        "type": "dispatch",
        "lane": 2
      },
      {
        "type": "dispatch",
        "lane": 3
      },
      {
        "type": "dispatch",
        "lane": 3
      },
      {
        "type": "dispatch",
        "lane": 2
      },
      {
        "type": "swap"
      },
      {
        "type": "dispatch",
        "lane": 3
      }
    ]
  },
  {
    "index": 44,
    "chapter": 8,
    "colors": 4,
    "par": 10,
    "baySize": 2,
    "buses": [
      {
        "color": 2,
        "seats": 2
      },
      {
        "color": 0,
        "seats": 2
      },
      {
        "color": 3,
        "seats": 2
      },
      {
        "color": 1,
        "seats": 2
      },
      {
        "color": 2,
        "seats": 2
      }
    ],
    "queues": [
      [
        2,
        0
      ],
      [
        3,
        0
      ],
      [
        3,
        1,
        2
      ],
      [
        1,
        2,
        2
      ]
    ],
    "transferGates": [
      {
        "lane": 1,
        "unlockAfter": 1
      },
      {
        "lane": 2,
        "unlockAfter": 2
      }
    ],
    "transferPriority": [
      {
        "lane": 1,
        "position": 1
      },
      {
        "lane": 3,
        "position": 2
      }
    ],
    "holdingTarget": 2,
    "solution": [
      {
        "type": "dispatch",
        "lane": 0
      },
      {
        "type": "dispatch",
        "lane": 3
      },
      {
        "type": "dispatch",
        "lane": 3
      },
      {
        "type": "dispatch",
        "lane": 0
      },
      {
        "type": "dispatch",
        "lane": 1
      },
      {
        "type": "dispatch",
        "lane": 1
      },
      {
        "type": "dispatch",
        "lane": 2
      },
      {
        "type": "swap"
      },
      {
        "type": "dispatch",
        "lane": 2
      },
      {
        "type": "dispatch",
        "lane": 2
      },
      {
        "type": "dispatch",
        "lane": 3
      }
    ]
  },
  {
    "index": 45,
    "chapter": 9,
    "colors": 4,
    "par": 8,
    "baySize": 2,
    "buses": [
      {
        "color": 0,
        "seats": 2
      },
      {
        "color": 1,
        "seats": 2
      },
      {
        "color": 2,
        "seats": 2
      },
      {
        "color": 3,
        "seats": 2
      }
    ],
    "queues": [
      [
        1,
        2
      ],
      [
        0,
        3
      ],
      [
        2
      ],
      [
        3,
        1,
        0
      ]
    ],
    "transferGates": [
      {
        "lane": 0,
        "unlockAfter": 1
      }
    ],
    "transferPriority": [
      {
        "lane": 1,
        "position": 1
      }
    ],
    "holdingTarget": 2,
    "solution": [
      {
        "type": "dispatch",
        "lane": 1
      },
      {
        "type": "dispatch",
        "lane": 3
      },
      {
        "type": "dispatch",
        "lane": 3
      },
      {
        "type": "dispatch",
        "lane": 3
      },
      {
        "type": "dispatch",
        "lane": 0
      },
      {
        "type": "swap"
      },
      {
        "type": "dispatch",
        "lane": 0
      },
      {
        "type": "dispatch",
        "lane": 2
      },
      {
        "type": "dispatch",
        "lane": 1
      }
    ]
  },
  {
    "index": 46,
    "chapter": 9,
    "colors": 4,
    "par": 8,
    "baySize": 2,
    "buses": [
      {
        "color": 3,
        "seats": 2
      },
      {
        "color": 1,
        "seats": 2
      },
      {
        "color": 0,
        "seats": 2
      },
      {
        "color": 2,
        "seats": 2
      }
    ],
    "queues": [
      [
        0
      ],
      [
        3,
        0
      ],
      [
        2,
        1
      ],
      [
        2,
        1,
        3
      ]
    ],
    "transferGates": [
      {
        "lane": 2,
        "unlockAfter": 1
      }
    ],
    "transferPriority": [
      {
        "lane": 0,
        "position": 0
      }
    ],
    "holdingTarget": 3,
    "solution": [
      {
        "type": "dispatch",
        "lane": 1
      },
      {
        "type": "dispatch",
        "lane": 3
      },
      {
        "type": "dispatch",
        "lane": 3
      },
      {
        "type": "dispatch",
        "lane": 3
      },
      {
        "type": "swap"
      },
      {
        "type": "dispatch",
        "lane": 2
      },
      {
        "type": "dispatch",
        "lane": 2
      },
      {
        "type": "dispatch",
        "lane": 0
      },
      {
        "type": "dispatch",
        "lane": 1
      }
    ]
  },
  {
    "index": 47,
    "chapter": 9,
    "colors": 4,
    "par": 10,
    "baySize": 2,
    "buses": [
      {
        "color": 1,
        "seats": 2
      },
      {
        "color": 3,
        "seats": 2
      },
      {
        "color": 2,
        "seats": 2
      },
      {
        "color": 0,
        "seats": 2
      },
      {
        "color": 1,
        "seats": 2
      }
    ],
    "queues": [
      [
        1
      ],
      [
        1,
        0
      ],
      [
        3,
        1,
        0,
        2,
        2
      ],
      [
        3,
        1
      ]
    ],
    "transferGates": [
      {
        "lane": 3,
        "unlockAfter": 1
      }
    ],
    "transferPriority": [
      {
        "lane": 1,
        "position": 1
      }
    ],
    "holdingTarget": 2,
    "solution": [
      {
        "type": "dispatch",
        "lane": 0
      },
      {
        "type": "dispatch",
        "lane": 1
      },
      {
        "type": "dispatch",
        "lane": 2
      },
      {
        "type": "dispatch",
        "lane": 2
      },
      {
        "type": "dispatch",
        "lane": 2
      },
      {
        "type": "dispatch",
        "lane": 3
      },
      {
        "type": "dispatch",
        "lane": 2
      },
      {
        "type": "dispatch",
        "lane": 2
      },
      {
        "type": "dispatch",
        "lane": 1
      },
      {
        "type": "swap"
      },
      {
        "type": "dispatch",
        "lane": 3
      }
    ]
  },
  {
    "index": 48,
    "chapter": 9,
    "colors": 4,
    "par": 8,
    "baySize": 2,
    "buses": [
      {
        "color": 2,
        "seats": 2
      },
      {
        "color": 1,
        "seats": 2
      },
      {
        "color": 3,
        "seats": 2
      },
      {
        "color": 0,
        "seats": 2
      }
    ],
    "queues": [
      [
        3,
        0
      ],
      [
        1
      ],
      [
        2,
        0,
        3,
        2
      ],
      [
        1
      ]
    ],
    "transferGates": [
      {
        "lane": 0,
        "unlockAfter": 1
      }
    ],
    "transferPriority": [
      {
        "lane": 1,
        "position": 0
      }
    ],
    "holdingTarget": 2,
    "solution": [
      {
        "type": "dispatch",
        "lane": 2
      },
      {
        "type": "dispatch",
        "lane": 2
      },
      {
        "type": "dispatch",
        "lane": 2
      },
      {
        "type": "dispatch",
        "lane": 2
      },
      {
        "type": "dispatch",
        "lane": 1
      },
      {
        "type": "dispatch",
        "lane": 3
      },
      {
        "type": "dispatch",
        "lane": 0
      },
      {
        "type": "swap"
      },
      {
        "type": "dispatch",
        "lane": 0
      }
    ]
  },
  {
    "index": 49,
    "chapter": 9,
    "colors": 4,
    "par": 10,
    "baySize": 2,
    "buses": [
      {
        "color": 0,
        "seats": 2
      },
      {
        "color": 3,
        "seats": 2
      },
      {
        "color": 1,
        "seats": 2
      },
      {
        "color": 2,
        "seats": 2
      },
      {
        "color": 0,
        "seats": 2
      }
    ],
    "queues": [
      [
        1,
        3
      ],
      [
        1
      ],
      [
        0,
        0
      ],
      [
        0,
        3,
        2,
        0,
        2
      ]
    ],
    "transferGates": [
      {
        "lane": 0,
        "unlockAfter": 1
      },
      {
        "lane": 2,
        "unlockAfter": 3
      }
    ],
    "transferPriority": [
      {
        "lane": 3,
        "position": 4
      },
      {
        "lane": 2,
        "position": 0
      }
    ],
    "holdingTarget": 3,
    "solution": [
      {
        "type": "dispatch",
        "lane": 3
      },
      {
        "type": "dispatch",
        "lane": 3
      },
      {
        "type": "dispatch",
        "lane": 3
      },
      {
        "type": "dispatch",
        "lane": 3
      },
      {
        "type": "dispatch",
        "lane": 0
      },
      {
        "type": "dispatch",
        "lane": 0
      },
      {
        "type": "dispatch",
        "lane": 1
      },
      {
        "type": "swap"
      },
      {
        "type": "dispatch",
        "lane": 3
      },
      {
        "type": "dispatch",
        "lane": 2
      },
      {
        "type": "dispatch",
        "lane": 2
      }
    ]
  },
  {
    "index": 50,
    "chapter": 10,
    "colors": 4,
    "par": 8,
    "baySize": 3,
    "buses": [
      {
        "color": 1,
        "seats": 2
      },
      {
        "color": 0,
        "seats": 2
      },
      {
        "color": 2,
        "seats": 2
      },
      {
        "color": 3,
        "seats": 2
      }
    ],
    "queues": [
      [
        1,
        2
      ],
      [
        3,
        2
      ],
      [
        0
      ],
      [
        0,
        1
      ],
      [
        3
      ]
    ],
    "transferGates": [
      {
        "lane": 4,
        "unlockAfter": 1
      }
    ],
    "transferPriority": [
      {
        "lane": 1,
        "position": 1
      }
    ],
    "holdingTarget": 2,
    "solution": [
      {
        "type": "dispatch",
        "lane": 0
      },
      {
        "type": "dispatch",
        "lane": 1
      },
      {
        "type": "dispatch",
        "lane": 3
      },
      {
        "type": "dispatch",
        "lane": 3
      },
      {
        "type": "dispatch",
        "lane": 2
      },
      {
        "type": "swap"
      },
      {
        "type": "dispatch",
        "lane": 0
      },
      {
        "type": "dispatch",
        "lane": 1
      },
      {
        "type": "dispatch",
        "lane": 4
      }
    ]
  },
  {
    "index": 51,
    "chapter": 10,
    "colors": 4,
    "par": 10,
    "baySize": 3,
    "buses": [
      {
        "color": 3,
        "seats": 2
      },
      {
        "color": 2,
        "seats": 2
      },
      {
        "color": 0,
        "seats": 2
      },
      {
        "color": 1,
        "seats": 2
      },
      {
        "color": 3,
        "seats": 2
      }
    ],
    "queues": [
      [
        1,
        3,
        3
      ],
      [
        0,
        0,
        2
      ],
      [
        2
      ],
      [
        3,
        1
      ],
      [
        3
      ]
    ],
    "transferGates": [
      {
        "lane": 3,
        "unlockAfter": 2
      }
    ],
    "transferPriority": [
      {
        "lane": 4,
        "position": 0
      }
    ],
    "holdingTarget": 4,
    "solution": [
      {
        "type": "dispatch",
        "lane": 1
      },
      {
        "type": "dispatch",
        "lane": 0
      },
      {
        "type": "dispatch",
        "lane": 0
      },
      {
        "type": "dispatch",
        "lane": 0
      },
      {
        "type": "dispatch",
        "lane": 1
      },
      {
        "type": "dispatch",
        "lane": 1
      },
      {
        "type": "dispatch",
        "lane": 2
      },
      {
        "type": "dispatch",
        "lane": 3
      },
      {
        "type": "swap"
      },
      {
        "type": "dispatch",
        "lane": 3
      },
      {
        "type": "dispatch",
        "lane": 4
      }
    ]
  },
  {
    "index": 52,
    "chapter": 10,
    "colors": 4,
    "par": 8,
    "baySize": 3,
    "buses": [
      {
        "color": 0,
        "seats": 2
      },
      {
        "color": 2,
        "seats": 2
      },
      {
        "color": 3,
        "seats": 2
      },
      {
        "color": 1,
        "seats": 2
      }
    ],
    "queues": [
      [
        2
      ],
      [
        1,
        0
      ],
      [
        3,
        2
      ],
      [
        0,
        1
      ],
      [
        3
      ]
    ],
    "transferGates": [
      {
        "lane": 2,
        "unlockAfter": 1
      }
    ],
    "transferPriority": [
      {
        "lane": 0,
        "position": 0
      }
    ],
    "holdingTarget": 2,
    "solution": [
      {
        "type": "dispatch",
        "lane": 1
      },
      {
        "type": "dispatch",
        "lane": 1
      },
      {
        "type": "dispatch",
        "lane": 3
      },
      {
        "type": "dispatch",
        "lane": 0
      },
      {
        "type": "dispatch",
        "lane": 2
      },
      {
        "type": "dispatch",
        "lane": 2
      },
      {
        "type": "dispatch",
        "lane": 4
      },
      {
        "type": "swap"
      },
      {
        "type": "dispatch",
        "lane": 3
      }
    ]
  },
  {
    "index": 53,
    "chapter": 10,
    "colors": 4,
    "par": 10,
    "baySize": 3,
    "buses": [
      {
        "color": 2,
        "seats": 2
      },
      {
        "color": 1,
        "seats": 2
      },
      {
        "color": 3,
        "seats": 2
      },
      {
        "color": 0,
        "seats": 2
      },
      {
        "color": 2,
        "seats": 2
      }
    ],
    "queues": [
      [
        2
      ],
      [
        1,
        2,
        0
      ],
      [
        2,
        0,
        1
      ],
      [
        3
      ],
      [
        2,
        3
      ]
    ],
    "transferGates": [
      {
        "lane": 2,
        "unlockAfter": 1
      }
    ],
    "transferPriority": [
      {
        "lane": 3,
        "position": 0
      }
    ],
    "holdingTarget": 3,
    "solution": [
      {
        "type": "dispatch",
        "lane": 0
      },
      {
        "type": "dispatch",
        "lane": 4
      },
      {
        "type": "dispatch",
        "lane": 1
      },
      {
        "type": "dispatch",
        "lane": 2
      },
      {
        "type": "dispatch",
        "lane": 2
      },
      {
        "type": "dispatch",
        "lane": 1
      },
      {
        "type": "dispatch",
        "lane": 2
      },
      {
        "type": "dispatch",
        "lane": 3
      },
      {
        "type": "dispatch",
        "lane": 4
      },
      {
        "type": "dispatch",
        "lane": 1
      },
      {
        "type": "swap"
      }
    ]
  },
  {
    "index": 54,
    "chapter": 10,
    "colors": 4,
    "par": 10,
    "baySize": 3,
    "buses": [
      {
        "color": 3,
        "seats": 2
      },
      {
        "color": 0,
        "seats": 2
      },
      {
        "color": 1,
        "seats": 2
      },
      {
        "color": 2,
        "seats": 2
      },
      {
        "color": 3,
        "seats": 2
      }
    ],
    "queues": [
      [
        2,
        0,
        3
      ],
      [
        1
      ],
      [
        0,
        3,
        2
      ],
      [
        3
      ],
      [
        1,
        3
      ]
    ],
    "transferGates": [
      {
        "lane": 3,
        "unlockAfter": 3
      },
      {
        "lane": 1,
        "unlockAfter": 1
      }
    ],
    "transferPriority": [
      {
        "lane": 4,
        "position": 0
      },
      {
        "lane": 3,
        "position": 0
      }
    ],
    "holdingTarget": 3,
    "solution": [
      {
        "type": "dispatch",
        "lane": 2
      },
      {
        "type": "dispatch",
        "lane": 0
      },
      {
        "type": "dispatch",
        "lane": 0
      },
      {
        "type": "dispatch",
        "lane": 0
      },
      {
        "type": "dispatch",
        "lane": 2
      },
      {
        "type": "swap"
      },
      {
        "type": "dispatch",
        "lane": 1
      },
      {
        "type": "dispatch",
        "lane": 4
      },
      {
        "type": "dispatch",
        "lane": 2
      },
      {
        "type": "dispatch",
        "lane": 3
      },
      {
        "type": "dispatch",
        "lane": 4
      }
    ]
  },
  {
    "index": 55,
    "chapter": 11,
    "colors": 4,
    "par": 10,
    "baySize": 2,
    "buses": [
      {
        "color": 0,
        "seats": 2
      },
      {
        "color": 3,
        "seats": 2
      },
      {
        "color": 2,
        "seats": 2
      },
      {
        "color": 1,
        "seats": 2
      },
      {
        "color": 0,
        "seats": 2
      }
    ],
    "queues": [
      [
        1
      ],
      [
        0
      ],
      [
        0
      ],
      [
        3,
        0,
        2,
        3
      ],
      [
        0,
        2,
        1
      ]
    ],
    "transferGates": [
      {
        "lane": 3,
        "unlockAfter": 1
      }
    ],
    "transferPriority": [
      {
        "lane": 0,
        "position": 0
      }
    ],
    "holdingTarget": 2,
    "solution": [
      {
        "type": "dispatch",
        "lane": 1
      },
      {
        "type": "dispatch",
        "lane": 4
      },
      {
        "type": "dispatch",
        "lane": 3
      },
      {
        "type": "dispatch",
        "lane": 3
      },
      {
        "type": "dispatch",
        "lane": 3
      },
      {
        "type": "dispatch",
        "lane": 3
      },
      {
        "type": "dispatch",
        "lane": 4
      },
      {
        "type": "swap"
      },
      {
        "type": "dispatch",
        "lane": 0
      },
      {
        "type": "dispatch",
        "lane": 4
      },
      {
        "type": "dispatch",
        "lane": 2
      }
    ]
  },
  {
    "index": 56,
    "chapter": 11,
    "colors": 4,
    "par": 10,
    "baySize": 2,
    "buses": [
      {
        "color": 2,
        "seats": 2
      },
      {
        "color": 1,
        "seats": 2
      },
      {
        "color": 0,
        "seats": 2
      },
      {
        "color": 3,
        "seats": 2
      },
      {
        "color": 2,
        "seats": 2
      }
    ],
    "queues": [
      [
        3,
        1,
        2,
        3
      ],
      [
        2
      ],
      [
        2
      ],
      [
        1
      ],
      [
        2,
        0,
        0
      ]
    ],
    "transferGates": [
      {
        "lane": 2,
        "unlockAfter": 1
      }
    ],
    "transferPriority": [
      {
        "lane": 3,
        "position": 0
      }
    ],
    "holdingTarget": 2,
    "solution": [
      {
        "type": "dispatch",
        "lane": 0
      },
      {
        "type": "dispatch",
        "lane": 0
      },
      {
        "type": "dispatch",
        "lane": 0
      },
      {
        "type": "dispatch",
        "lane": 4
      },
      {
        "type": "dispatch",
        "lane": 3
      },
      {
        "type": "swap"
      },
      {
        "type": "dispatch",
        "lane": 4
      },
      {
        "type": "dispatch",
        "lane": 4
      },
      {
        "type": "dispatch",
        "lane": 0
      },
      {
        "type": "dispatch",
        "lane": 1
      },
      {
        "type": "dispatch",
        "lane": 2
      }
    ]
  },
  {
    "index": 57,
    "chapter": 11,
    "colors": 4,
    "par": 10,
    "baySize": 2,
    "buses": [
      {
        "color": 1,
        "seats": 2
      },
      {
        "color": 3,
        "seats": 2
      },
      {
        "color": 0,
        "seats": 2
      },
      {
        "color": 2,
        "seats": 2
      },
      {
        "color": 1,
        "seats": 2
      }
    ],
    "queues": [
      [
        0
      ],
      [
        1
      ],
      [
        1,
        3
      ],
      [
        1,
        2,
        3
      ],
      [
        0,
        1,
        2
      ]
    ],
    "transferGates": [
      {
        "lane": 2,
        "unlockAfter": 1
      },
      {
        "lane": 4,
        "unlockAfter": 2
      }
    ],
    "transferPriority": [
      {
        "lane": 0,
        "position": 0
      }
    ],
    "holdingTarget": 3,
    "solution": [
      {
        "type": "dispatch",
        "lane": 1
      },
      {
        "type": "dispatch",
        "lane": 3
      },
      {
        "type": "dispatch",
        "lane": 2
      },
      {
        "type": "dispatch",
        "lane": 2
      },
      {
        "type": "dispatch",
        "lane": 3
      },
      {
        "type": "dispatch",
        "lane": 3
      },
      {
        "type": "dispatch",
        "lane": 0
      },
      {
        "type": "dispatch",
        "lane": 4
      },
      {
        "type": "swap"
      },
      {
        "type": "dispatch",
        "lane": 4
      },
      {
        "type": "dispatch",
        "lane": 4
      }
    ]
  },
  {
    "index": 58,
    "chapter": 11,
    "colors": 4,
    "par": 10,
    "baySize": 2,
    "buses": [
      {
        "color": 3,
        "seats": 2
      },
      {
        "color": 2,
        "seats": 2
      },
      {
        "color": 1,
        "seats": 2
      },
      {
        "color": 0,
        "seats": 2
      },
      {
        "color": 3,
        "seats": 2
      }
    ],
    "queues": [
      [
        1,
        2,
        3
      ],
      [
        0,
        3,
        0
      ],
      [
        3
      ],
      [
        1
      ],
      [
        2,
        3
      ]
    ],
    "transferGates": [
      {
        "lane": 2,
        "unlockAfter": 1
      }
    ],
    "transferPriority": [
      {
        "lane": 2,
        "position": 0
      }
    ],
    "holdingTarget": 3,
    "solution": [
      {
        "type": "dispatch",
        "lane": 4
      },
      {
        "type": "dispatch",
        "lane": 1
      },
      {
        "type": "dispatch",
        "lane": 1
      },
      {
        "type": "dispatch",
        "lane": 4
      },
      {
        "type": "dispatch",
        "lane": 0
      },
      {
        "type": "dispatch",
        "lane": 0
      },
      {
        "type": "dispatch",
        "lane": 3
      },
      {
        "type": "swap"
      },
      {
        "type": "dispatch",
        "lane": 1
      },
      {
        "type": "dispatch",
        "lane": 0
      },
      {
        "type": "dispatch",
        "lane": 2
      }
    ]
  },
  {
    "index": 59,
    "chapter": 11,
    "colors": 4,
    "par": 12,
    "baySize": 2,
    "buses": [
      {
        "color": 0,
        "seats": 2
      },
      {
        "color": 2,
        "seats": 2
      },
      {
        "color": 3,
        "seats": 2
      },
      {
        "color": 1,
        "seats": 2
      },
      {
        "color": 0,
        "seats": 2
      },
      {
        "color": 3,
        "seats": 2
      }
    ],
    "queues": [
      [
        3,
        0
      ],
      [
        0,
        2
      ],
      [
        1,
        2,
        0
      ],
      [
        1,
        3
      ],
      [
        0,
        3,
        3
      ]
    ],
    "transferGates": [
      {
        "lane": 1,
        "unlockAfter": 1
      },
      {
        "lane": 3,
        "unlockAfter": 2
      }
    ],
    "transferPriority": [
      {
        "lane": 3,
        "position": 0
      },
      {
        "lane": 4,
        "position": 2
      }
    ],
    "holdingTarget": 3,
    "solution": [
      {
        "type": "dispatch",
        "lane": 2
      },
      {
        "type": "dispatch",
        "lane": 2
      },
      {
        "type": "dispatch",
        "lane": 2
      },
      {
        "type": "dispatch",
        "lane": 4
      },
      {
        "type": "swap"
      },
      {
        "type": "dispatch",
        "lane": 1
      },
      {
        "type": "dispatch",
        "lane": 1
      },
      {
        "type": "dispatch",
        "lane": 0
      },
      {
        "type": "dispatch",
        "lane": 4
      },
      {
        "type": "dispatch",
        "lane": 3
      },
      {
        "type": "dispatch",
        "lane": 0
      },
      {
        "type": "dispatch",
        "lane": 3
      },
      {
        "type": "dispatch",
        "lane": 4
      }
    ]
  }
];
  root.BUS_JAM_TRANSFER_LEVELS=levels;
  if(typeof module!=="undefined")module.exports=levels;
})(typeof window!=="undefined"?window:globalThis);
