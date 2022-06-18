const canvas = document.querySelector('canvas')  //selecting canvas
const context = canvas.getContext('2d')          //setting 2d canvas

canvas.width = 1024
canvas.height = 576       //16:9 ratio

context.fillRect(0, 0, 1024, 576)     // rectangle for background

const gravity = 0.5

const background = new Sprite
({
  position: {
    x: 0,
    y: 0
  },
  imageSrc: './img/backgroundCamp.png'
})

const backgroundCharacterLeft = new Sprite
({
  position: {
    x: 250,
    y: 345
  },
  imageSrc: './img/backgroundCharacterLeft.png',
  scale: 1.6,
  framesMax: 14
})

const backgroundCharacterCenter = new Sprite
({
  position: {
    x: 425,
    y: 365
  },
  imageSrc: './img/backgroundCharacterCenter.png',
  scale: 1.6,
  framesMax: 14
})

const backgroundCharacterRight= new Sprite
({
  position: {
    x: 600,
    y: 355
  },
  imageSrc: './img/backgroundCharacterRight.png',
  scale: 1.6,
  framesMax: 14
})

const player = new Fighter
({
    position: {x:0, y:0},
    velocity: {x:0, y:0},

  imageSrc: './img/heroKnight/Idle.png',
  framesMax: 11,
  scale: 2.1,
  offset:
    {
      x: 0,
      y: 0
    },
  sprites:
    {
      idle:
        {
          imageSrc: './img/heroKnight/Idle.png',
          framesMax: 11
        },
      run:
        {
          imageSrc: './img/heroKnight/Run.png',
          framesMax: 8

        },
      jump:
        {
          imageSrc: './img/heroKnight/Jump.png',
          framesMax: 4
        },
      fall:
        {
          imageSrc: './img/heroKnight/Fall.png',
          framesMax: 4
        },
      attack:
        {
          imageSrc: './img/heroKnight/Attack.png',
          framesMax: 6
        },
      takeHit:
        {
          imageSrc: './img/heroKnight/TakeHit.png',
          framesMax: 4
        },
      death:
        {
          imageSrc: './img/heroKnight/Death.png',
          framesMax: 9
        }
    },
      attackBox:
        {
          offset:
            {
              x: 152 ,
              y: 90
            },
          width: 100,
          height: 50
        }
  })

//enemy class
const enemy = new Fighter
  ({
  position: {x:900, y:100},
  velocity: {x:0, y:0},
    color: 'blue',

    imageSrc: './img/evilWizard/Idle.png',
    framesMax: 8,
    scale: 1.8,
    offset:
      {
        x: 260,
        y: 126
      },
    sprites:
      {
        idle:
          {
            imageSrc: './img/evilWizard/Idle.png',
            framesMax: 8
          },
        run:
          {
            imageSrc: './img/evilWizard/Run.png',
            framesMax: 8
          },
        jump:
          {
            imageSrc: './img/evilWizard/Jump.png',
            framesMax: 2
          },
        fall:
          {
            imageSrc: './img/evilWizard/Fall.png',
            framesMax: 2
          },
        attack:
          {
            imageSrc: './img/evilWizard/Attack1.png',
            framesMax: 8
          },
        takeHit:
          {
            imageSrc:'./img/evilWizard/TakeHit.png',
            framesMax: 3
          },
        death:
          {
            imageSrc: './img/evilWizard/Death.png',
            framesMax: 7
          }
      },
        attackBox:
          {
            offset:
              {
                x: -150,
                y: 70
              },
            width: 120,
            height: 40
          }
  })

console.log(player)

const keys = {                        //identifier for key press
  a: {
    pressed: false
  },
  s: {
    pressed: false
  },
  ArrowRight: {
    pressed: false
  },
  ArrowLeft: {
    pressed: false
  }
}

decreaseTimer()

function animate()                           // animation function
{
  window.requestAnimationFrame(animate)                           //one infinite loop to animate
  context.fillStyle = 'black'
  context.fillRect(0, 0, canvas.width, canvas.height)        //clearing canvas so animation does not run on

  background.update()                                              //called before player

  backgroundCharacterLeft.update()
  backgroundCharacterCenter.update()
  backgroundCharacterRight.update()

  //player-background contrast layer
  context.fillStyle = 'rgba(255, 255, 255, 0.08)'
  context.fillRect(0, 0, canvas.width, canvas.height)

  player.update()
  enemy.update()


  player.velocity.x = 0                    //set default x velocity


  if (keys.a.pressed && player.lastKey === 'a')                      //loop to check if key is pressed and resulting movement
  {
    player.velocity.x = -5
    player.switchSprite('run')
  }
  else if (keys.s.pressed && player.lastKey === 's')
  {
    player.velocity.x = 5
    player.switchSprite('run')
  }
  else
  {
    player.switchSprite('idle')
  }

  if(player.velocity.y < 0)
  {
    player.switchSprite('jump')
  }
  else if (player.velocity.y > 0)
  {
    player.switchSprite('fall')
  }


  //enemy
  enemy.velocity.x = 0

  if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft')                      //loop to check if key is pressed and resulting movement
  {
    enemy.velocity.x = -5
    enemy.switchSprite('run')

  }
  else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight')

  {
    enemy.velocity.x = 5
    enemy.switchSprite('run')
  }
  else
  {
    enemy.switchSprite('idle')
  }

  if(enemy.velocity.y < 0)                                        //jumping
  {
    enemy.switchSprite('jump')
  }
  else if (enemy.velocity.y > 0)
  {
    enemy.switchSprite('fall')
  }


                                                          //detect for collision
  if (
    rectangularCollision({
      rectangle1: player,
      rectangle2: enemy
    })
    && player.isAttacking && player.framesCurrent === 4)
  {
    enemy.takeHit()
    player.isAttacking = false
               // document.querySelector('#enemyHealth').style.width = enemy.health + '%'
    gsap.to('#enemyHealth',
      {
        width: enemy.health + '%'
      })
  }

  //if player misses
  if (player.isAttacking && player.framesCurrent === 4)
  {
    player.isAttacking = false
  }


                                                          //enemyCollision
  if (
    rectangularCollision({
      rectangle1: enemy,
      rectangle2: player
    })
    && enemy.isAttacking && enemy.framesCurrent === 3)
  {
    player.takeHit()
    enemy.isAttacking = false
         // document.querySelector('#playerHealth').style.width = player.health + '%'
    gsap.to('#playerHealth',
      {
        width: player.health + '%'
      })
  }

  //enemy misses
  if (enemy.isAttacking && player.framesCurrent === 3)
  {
    enemy.isAttacking = false
  }

  //end game = zero health
  if(enemy.health <= 0 || player.health <= 0)
  {
    determineWinner({player, enemy, timerId})
  }
}


animate()

window.addEventListener('keydown', (event) =>               //setup event to register keystroke - actions
{
  if(!player.dead)
  {

  // console.log(event.key)
  switch(event.key)
  {
    case 's':
      keys.s.pressed = true
      player.lastKey = 's'
      break
    case 'a':
      keys.a.pressed = true
      player.lastKey = 'a'
      break
    case 'w':
      player.velocity.y = -15
      break
    case 'r':
      player.attack()
      break
  }
  }

  if(!enemy.dead)
  {
    switch (event.key)
    {
      //enemy controls
      case 'ArrowRight':
        keys.ArrowRight.pressed = true
        enemy.lastKey = 'ArrowRight'
        break
      case 'ArrowLeft':
        keys.ArrowLeft.pressed = true
        enemy.lastKey = 'ArrowLeft'
        break
      case 'ArrowUp':
        enemy.velocity.y = -15
        break
      case 'ArrowDown':
        enemy.attack()
        break
    }
  }                   // console.log(event.key); viewing in browser
})

window.addEventListener('keyup', (event) =>               //setup event to register releasing keystroke
{
  switch(event.key)
  {
    case 's':
      keys.s.pressed = false
      break
    case 'a':
      keys.a.pressed = false
      break
  }

  switch(event.key)           //enemy
  {
    case 'ArrowRight':
      keys.ArrowRight.pressed = false
      break
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = false
      break
  }

  console.log(event.key);
})


