## tinyJQ


1. 创建一个实例

   + $('div')

2. $方法使用介绍

   + $('+div')~=document.createElement('div')
   + $('-div')~=document.querySelector('div').parentNode.removeChild('div') 
   + $('div')~=document.querySelector('div')
   + $('div',true)~=document.querySelectorAll('div')
   + $(document.querySelector('#app'))~=$('#app')
   + $(document.querySelectorAll('.app'))~=$('.app',true)

3. $quicksort 快速排序

   + let arr=[1,2,4,3];
   + $quicksort(arr);
   + console.log(arr);
   + //[1,2,3,4];

4. $random 随机整数

   + console.log($random（4，9）)；

   + // 4/5/6/7/8/9

5. addEvent 绑定事件

   + $('#app').addEvent('click',()=>{

     //xxxx

     });

     ~=

     document.querySelector('#app').addEventListener('click',()=>{

     //xxx

     });

   + $('#app').addEvent({

     'click':()=>();

     'keyup':()=>();

     //...

     });

     //该参数用obj代指

     ~=

     for (let key in obj){

     document.querySelector('#app').addEventListener(key，obj[key]);

     } 
     
   + $('.app',true).addEvent('click',[()=>(),()=>(),()=>()])

  第二个参数用fn代指

  ~  =
   Array.from(document.querySelectorAll('.app')).some((x,i)=>{
    if(fn[i])
     x.addEventListener('click',fn[i]); 

else{
	return true
	}

}

 )     
6. css  层叠样式表操作和取值
   + $('#app').css('color','red')~=document.querySelector('#app').style.color='red';

   + console.log($('#app').css('color'))

    //red

    ~=document.querySelector('#app').style.color
  
   + $('#app').css({

     ​	color:'red',

     ​	textAlign:'center',

     })

     类同addEvent里的参数为对象的用法，参数为数组亦是

  7. class 类名操作

     + $('#app').class('+app')~= document.querySelector('#app').classlist.add('app')
     + $('#app').class('-app')~= ...remove('app')
     + $('#app').class('app')~=...toggle('app') 

  8. Sibling 兄弟元素操作

     + $('#app').Sibling(($v,index)=>{

       //xxx

       },'div')

       用语言叙述吧，找到id为app的元素的父节点，然后找到该父节点中id为app节点外的所有div标签，然后执行传入的方法(执行时传入两个参数，一个是执行对象下的dom元素,一个是对应索引)

       最后会返回这些被执行操作的元素的数组集合
       
       

   9. eq 获取指定索引的实例对象

      + $('.app',true).eq(2)~=document.querySelectorAll('.app')[2]
      
   10. all 对所有元素执行相同操作

       + $('.app',true).all((vm,i)=>{

         ​	vm.style.color=red;

         if(i!==1)

         ​	$(vm).css('color')='blue';

         });
       
   11. text获取和修改值

       + $('#app').text()~=document.querySelector('#app').innerText||document.querySelector('#app').value

       + $("#app").text(true)~=document.querySelector('#app').textContent
       
       + $('#app').text("u8")~= document.querySelector('#app').textContent="u8"
       
   12. 剩余方法详见源码...
       
   13. 链式调用

       + $('#app').$('div',true).css('color','red').all((vm,i)=>{$(vm).class('+tinyJQ')}).eq(0).dom

         

       

