export default class IndexedPriorityQueue
{
	constructor(keys)
	{
		this.keys = keys
		this.data = []
	}

	insert(index)
	{
		this.data.push(index)
		this.reorderUp()
	}

	pop()
	{
		const r = this.data[0]
		this.data[0] = this.data[this.data.length-1]
		this.data.pop()
		this.reorderDown()
		return r
	}
/*
	reorderUp()	{
		let a = this.data.length-1
		while (a > 0) {
			if(this.keys[this.data[a]]<this.keys[this.data[a-1]])
			{
				let tmp=this.data[a]
				this.data[a]=this.data[a-1]
				this.data[a-1]=tmp
			}
			else {return}
			a--
		}
	}
*/
	reorderUp()
	{
	  const {keys, data} = this
	  let a = data.length - 1
		//let keys = this.keys, data = this.data, a = data.length - 1
		
		while (a > 0)
		{
			if( keys[ data[a] ] < keys[ data[a - 1] ] )
			{
				// [ this.data[a], this.data[a - 1] ] = [ this.data[a - 1], this.data[a] ]
				let tmp = data[a]
				data[a] = data[a - 1]
				data[a - 1] = tmp
			}
			else
			{
				return
			}
			
			//decrement "a"
			a--
		}
	}

	
	// const {clear, log, dir} = console
	// clear()
	// const ary = [..."ABCDEF"]
	
	// function test(data = ary)
	// {
	//   //for (let prevIdx = data.length, idx = --prevIdx, temp;  idx = prevIdx--  ;)
	//   for (let {length: prevIdx} = data, idx = --prevIdx;  idx = prevIdx--  ;/**/)
	//   {
	//     log(`prevIdx = ${prevIdx}, idx = ${idx}, length = ${data.length}`)
	//   }
	// }
	
	// test()
	
	
	reorderDown()
	{
		const {keys, data} = this
	
		for (let idx = 0, nextIdx = 1, len = data.length - 1, tmp; idx < len; nextIdx = ++idx + 1)
		{
			if(keys[data[idx]] > keys[data[nextIdx]])
			{
				tmp = data[idx]
				data[idx] = data[nextIdx]
				data[nextIdx] = tmp
			}
			else
			{
				return
			}
		}
	}
	/*
	reorderDown()
	{
		const {keys, data} = this
	
		for (let a = 0, len = data.length - 1, tmp; a < len; a++)
		{
			if(keys[data[a]] > keys[data[a + 1]])
			{
				tmp = data[a]
				data[a] = data[a + 1]
				data[a + 1] = tmp
			}
			else {
				return
			}
		}
	}*/
	
	isEmpty()	{
		return (this.data.length === 0)
	}
		
}


