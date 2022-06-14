import Phaser from 'phaser';

import walkEvents from './walkEvents.mjs';

export default class WalkComponent
{
    constructor(parent, speed = 60)
    {
        this.parent = parent

        //basically 'isPaused'
        this.aTargetExists = false

        this.destinations = []
        this.highestIndex = 0
        
        this.automaticStart = false

        this.startCoords = new Phaser.Math.Vector2()
        this.endCoords = new Phaser.Math.Vector2()
        this.velocity = new Phaser.Math.Vector2()

        this.maxDistAllowed = 0

        // this.defaultSpeed = this.calcSpeed(speed)
        this.speed = this.calcSpeed(speed) // speed * 0.001

    } // end constructor

    // Idle status: no movement/destination/velocity setted. The sprite stay still/stops
    setIdle()
    {
        this.aTargetExists = false
        this.destinations.length = 0
    }

    pause()
    {
        this.aTargetExists = false
    }

    /*
    * @method WalkComponent#setPath
    * @param {point-like object[]} dest - single point-like object, or an Array of point-like objects 
    */
    setPath(dest)
    {
        // First of all reset potential old data, and stop any movement.
        this.setIdle()

        // add destination(s) to destinations array
        if (Array.isArray(dest))
        {
            if (!dest.length)
            {
                return false
            }

            this.destinations.push(...dest)
        }
        else
        {
            this.destinations.push(dest)
        }

        // DO we need the following 'if'?
        this.highestIndex = this.destinations.length - 1

        if (this.destinations.length)
        {
            // there are targets, so let's 'grab one
            this.grabTarget()
        }

    }

    // now we have a target pool! Let's grab one!
    grabTarget()
    {
        const dest = this.destinations.pop()

        if (dest)
        {
            // ok! Setup target!
            this.startCoords.copy(this.parent)
            this.endCoords.copy(dest)

            this.maxDistAllowed = this.startCoords.distanceSq(this.endCoords)

            this.velocity
                .copy(this.endCoords)
                .subtract(this.startCoords)
                .normalize()

            // time for events events:
            if (this.destinations.length === this.highestIndex)
            {
                // console.log("Walk event:", walkEvents.WALK_START)
                this.parent.emit(walkEvents.WALK_START, this.parent, this.startCoords, this.endCoords)
            }

            else
            {
                // console.log("Walk event:", walkEvents.WALK_SUBSTART)
                this.parent.emit(walkEvents.WALK_SUBSTART, this.parent, this.startCoords, this.endCoords)
            }

        }
        
        else
        {
            // emit THERE ARE NO TARGETS!
            // console.log("Walk event:", walkEvents.WALK_STAY_IDLE)
            this.parent.emit(walkEvents.WALK_STAY_IDLE)
            // console.log("Emitted: No more Target, or, maybe better: The previous Target turned out to be the last")
            // ...so let's wait for one.
            this.setIdle()
        }
    }

    start()
    {
        this.aTargetExists = true
    }

    update(time, delta)
    {
        if (this.aTargetExists)
        {
            const vel = this.speed * delta

            this.parent.x += this.velocity.x * vel

            this.parent.y += this.velocity.y * vel

            // (Maybe... squared?)
            if (this.startCoords.distanceSq(this.parent) >= this.maxDistAllowed)
            // if(this.startCoords.distance(this.parent) >= this.maxDistAllowed)
            
            // our target as been reached!
            {
                this.aTargetExists = false
                this.parent.x = this.endCoords.x
                this.parent.y = this.endCoords.y

                if (this.destinations.length === 0)
                {
                    // console.log("Walk event:", walkEvents.WALK_COMPLETE)
                    this.parent.emit(walkEvents.WALK_COMPLETE, this.parent)
                }
                else
                {
                    // and now... try for another target!
                    this.grabTarget()
                }

            }
        }

    }

  destroy()
  {
  	for (const walkEventName of Object.values(walkEvents))
    {
    	this.parent.off(walkEventName)
    }
    
    this.aTargetExists = undefined
    this.parent = undefined
    this.destinations.length = 0
    this.destinations = undefined

    this.startCoords = undefined
    this.endCoords = undefined
    this.velocity = undefined

    this.maxDistAllowed = undefined
    this.speed = undefined
  }

  calcSpeed(numSpeed)
  {
      console.log("SP", WalkComponent)
      return Phaser.Math.GetSpeed(numSpeed, 1)
  }


//   setSpeed(n)
//   {
//       this.speed = this.calcSpeed(n)
//   }

}