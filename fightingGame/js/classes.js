class Sprite
{
  constructor({position, imageSrc, scale = 1, framesMax = 1, offset = {x: 0, y: 0}})       //wrapping both arguments as ONE property using {}
  {
    this.position = position
    this.width = 50
    this.height = 150
    this.image = new Image()            //creates a new html image inside a JS property
    this.image.src = imageSrc
    this.scale = scale
    this.framesMax = framesMax
    this.framesCurrent = 0
    this.framesElapsed = 0
    this.framesHold = 11
    this.offset = offset
  }

  drawOut()                            //draw to window
  {
    context.drawImage
    (
      this.image,
      this.framesCurrent * (this.image.width / this.framesMax),
      0,
      this.image.width / this.framesMax,
      this.image.height,
      this.position.x - this.offset.x,
      this.position.y - this.offset.y,
      (this.image.width / this.framesMax) * this.scale,
      this.image.height * this.scale
    )
  }

  animateFrames()
  {
    this.framesElapsed++

    if (this.framesElapsed % this.framesHold === 0)
    {
      if (this.framesCurrent < this.framesMax - 1)
      {
        this.framesCurrent++
      }
      else
      {
        this.framesCurrent = 0
      }
    }
  }

  update()                            //to animate movement
  {
    this.drawOut()
    this.animateFrames()
  }
}

class Fighter extends Sprite
{
  constructor
  ({
                position,
                velocity,
                color = 'red',
                imageSrc,
                scale = 1,
                framesMax = 1,
                offset = {x: 0, y: 0},
                sprites,
                attackBox = { offset: {}, width: undefined, height: undefined}

  })
  {
    super
    ({
      position,
      imageSrc,
      scale,
      framesMax,
      offset
    })
    this.velocity = velocity
    this.width = 50
    this.height = 150
    this.lastKey
    this.attackBox =                    //create attackBox
      {
        position:
          {
            x: this.position.x,
            y: this.position.y
          },
        offset: attackBox.offset,
        width: attackBox.width,
        height: attackBox.height,
      }
    this.color = color
    this.isAttacking
    this.health = 100
    this.framesCurrent = 0
    this.framesElapsed = 0
    this.framesHold = 11
    this.sprites = sprites
    this.dead = false

    for(const sprite in this.sprites)
    {
      sprites[sprite].image = new Image()
      sprites[sprite].image.src = sprites[sprite].imageSrc
    }

  }

  //deleted rectangles for sprite images
  // drawOut()                            //draw to window
  // {
  //   context.fillStyle = this.color
  //   context.fillRect(this.position.x, this.position.y, this.width, this.height)      //set position to x,y and define width/height
  //
  //   if(this.isAttacking)
  //   {
  //     context.fillStyle = 'green'                                                  //attackBox
  //     context.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height)
  //   }
  // }

  update()                            //to animate movement
  {
    this.drawOut()
    if (!this.dead) this.animateFrames()

    //attackBoxes
    this.attackBox.position.x = this.position.x + this.attackBox.offset.x
    this.attackBox.position.y = this.position.y + this.attackBox.offset.y


    //draw attackBox
    // context.fillRect
    // (
    //   this.attackBox.position.x,
    //   this.attackBox.position.y,
    //   this.attackBox.width,
    //   this.attackBox.height
    // )

    this.position.x += this.velocity.x
    this.position.y += this.velocity.y             // update movement over time

    //gravity function
    if (this.position.y + this.height + this.velocity.y >= canvas.height - 96)      //if >= the canvas.height, velocity is set to 0 to stop
    {
      this.velocity.y = 0
      this.position.y = 336
    } else
    {
      this.velocity.y += gravity                      // add gravity

    }
  }

//attack method
  attack()
  {
    this.switchSprite('attack')
    this.isAttacking = true
  }

  takeHit()
  {
    this.health -= 20

    if(this.health <= 0)
    {
      this.switchSprite('death')
    }
    else
    {
      this.switchSprite('takeHit')
    }
  }

  switchSprite(sprite)
  {
    if (this.image === this.sprites.death.image)
    {
      if(this.framesCurrent === this.sprites.death.framesMax - 1)
        this.dead = true
      return
    }

  //overriding all animations with the attack animation
    if (this.image === this.sprites.attack.image
      && this.framesCurrent < this.sprites.attack.framesMax - 1)
      return

    //override when fighter gets hit
    if (this.image === this.sprites.takeHit.image
      && this.framesCurrent < this.sprites.takeHit.framesMax - 1)
      return

    switch(sprite)
    {
      case 'idle':
        if(this.image !== this.sprites.idle.image)
        {
          this.image = this.sprites.idle.image
          this.framesMax = this.sprites.idle.framesMax
          this.framesCurrent = 0
        }
        break;

      case 'run':
        if(this.image !== this.sprites.run.image)
        {
          this.image = this.sprites.run.image
          this.framesMax = this.sprites.run.framesMax
          this.framesCurrent = 0
        }
        break;

      case 'jump':
      if(this.image !== this.sprites.jump.image)
      {
        this.image = this.sprites.jump.image
        this.framesMax = this.sprites.jump.framesMax
        this.framesCurrent = 0
      }
      break;

      case 'fall':
        if(this.image !== this.sprites.fall.image)
        {
          this.image = this.sprites.fall.image
          this.framesMax = this.sprites.fall.framesMax
          this.framesCurrent = 0
        }
        break;

      case 'attack':
        if(this.image !== this.sprites.attack.image)
        {
          this.image = this.sprites.attack.image
          this.framesMax = this.sprites.attack.framesMax
          this.framesCurrent = 0
        }
        break;

      case 'takeHit':
        if(this.image !== this.sprites.takeHit.image)
        {
          this.image = this.sprites.takeHit.image
          this.framesMax = this.sprites.takeHit.framesMax
          this.framesCurrent = 0
        }
        break;

      case 'death':
        if(this.image !== this.sprites.death.image)
        {
          this.image = this.sprites.death.image
          this.framesMax = this.sprites.death.framesMax
          this.framesCurrent = 0
        }
        break;
    }
  }

}
