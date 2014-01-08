
csgstorage={};

csport={};
csport.drawingstate={};
csport.drawingstate.linecolor="rgb(0,0,255)";
csport.drawingstate.linecolorraw=[0,0,1];
csport.drawingstate.pointcolor="rgb(255,200,0)";
csport.drawingstate.pointcolorraw=[1,0.78,0];
csport.drawingstate.textcolor="rgb(0,0,0)";
csport.drawingstate.textcolorraw=[0,0,0];
csport.drawingstate.alpha=1.0;
csport.drawingstate.pointsize=4.0;
csport.drawingstate.linesize=1.0;
csport.drawingstate.textsize=20;

csport.drawingstate.matrix={};
csport.drawingstate.matrix.a=25;
csport.drawingstate.matrix.b=0;
csport.drawingstate.matrix.c=0;
csport.drawingstate.matrix.d=25;
csport.drawingstate.matrix.tx=250;
csport.drawingstate.matrix.ty=250;
csport.drawingstate.matrix.det= csport.drawingstate.matrix.a*csport.drawingstate.matrix.d
-csport.drawingstate.matrix.b*csport.drawingstate.matrix.c;

    csport.drawingstate.matrix.sdet=Math.sqrt(csport.drawingstate.matrix.det);


    csport.drawingstate.initialmatrix={};
    csport.drawingstate.initialmatrix.a=csport.drawingstate.matrix.a;
    csport.drawingstate.initialmatrix.b=csport.drawingstate.matrix.b;
    csport.drawingstate.initialmatrix.c=csport.drawingstate.matrix.c;
    csport.drawingstate.initialmatrix.d=csport.drawingstate.matrix.d;
    csport.drawingstate.initialmatrix.tx=csport.drawingstate.matrix.tx;
    csport.drawingstate.initialmatrix.ty=csport.drawingstate.matrix.ty;
    csport.drawingstate.initialmatrix.det=csport.drawingstate.matrix.det;
    csport.drawingstate.initialmatrix.sdet=csport.drawingstate.matrix.sdet;

    csport.clone=function (obj){
        if(obj == null || typeof(obj) != 'object')
            return obj;
        
        var temp = obj.constructor(); // changed
        
        for(var key in obj)
            temp[key] = csport.clone(obj[key]);
        return temp;
    }

    csgstorage.backup=csport.clone(csport.drawingstate);
    csgstorage.stack=[];


    var back= csport.clone(csport.drawingstate);


    csport.reset=function(){
        
        
        csport.drawingstate.matrix.a=csport.drawingstate.initialmatrix.a;
        csport.drawingstate.matrix.b=csport.drawingstate.initialmatrix.b;
        csport.drawingstate.matrix.c=csport.drawingstate.initialmatrix.c;
        csport.drawingstate.matrix.d=csport.drawingstate.initialmatrix.d;
        csport.drawingstate.matrix.tx=csport.drawingstate.initialmatrix.tx;
        csport.drawingstate.matrix.ty=csport.drawingstate.initialmatrix.ty;
        csport.drawingstate.matrix.det=csport.drawingstate.initialmatrix.det;
        csport.drawingstate.matrix.sdet=csport.drawingstate.initialmatrix.sdet;
    }

    csport.from=function(x,y,z){
        var xx=x/z;
        var yy=y/z;
        var m=csport.drawingstate.matrix;
        var xxx=xx*m.a-yy*m.b+m.tx;
        var yyy=xx*m.c-yy*m.d-m.ty;
        return [xxx,yyy];
    }


    csport.dumpTrafo=function(){
        
        var r=function(x){
            return Math.round(x*1000)/1000;
            
        }
        m=csport.drawingstate.matrix;
        
        console.log("a:"+r(m.a)+" "+
                    "b:"+r(m.b)+" "+
                    "c:"+r(m.c)+" "+
                    "d:"+r(m.d)+" "+
                    "tx:"+r(m.ty)+" "+
                    "ty:"+r(m.tx)
                    )
            
    }

    csport.applyMat=function(a,b,c,d,tx,ty){
        m=csport.drawingstate.matrix;
        var ra=  m.a*a+m.c*b;
        var rb=  m.b*a+m.d*b;
        var rc=  m.a*c+m.c*d;
        var rd=  m.b*c+m.d*d;
        var rtx= m.a*tx+m.c*ty+m.tx;
        var rty= m.b*tx+m.d*ty+m.ty;
        m.a=ra;
        m.b=rb;
        m.c=rc;
        m.d=rd;
        m.tx=rtx;
        m.ty=rty;
        m.det= csport.drawingstate.matrix.a*csport.drawingstate.matrix.d
            -csport.drawingstate.matrix.b*csport.drawingstate.matrix.c;
        
        m.sdet=Math.sqrt(csport.drawingstate.matrix.det);
        
    }

    csport.translate=function(tx,ty){
        csport.applyMat(1,0,0,1,tx,ty);
    }

    csport.rotate=function(w){
        var c=Math.cos(w);
        var s=Math.sin(w);
        csport.applyMat(c,s,-s,c,0,0);
    }

    csport.scale=function(s){
        csport.applyMat(s,0,0,s,0,0);
    }

    csport.gsave=function(){
        csgstorage.stack.push(csport.clone(csport.drawingstate));
        
    }

    csport.grestore=function(){
        if(csgstorage.stack.length!=0){
            csport.drawingstate=csgstorage.stack.pop();
        }
    }

    csport.greset=function(){
        csport.drawingstate =csport.clone(csgstorage.backup);
        csport.drawingstate.matrix.ty=csport.drawingstate.matrix.ty-csh;
        csport.drawingstate.initialmatrix.ty=csport.drawingstate.initialmatrix.ty-csh;
    }

    csport.setcolor=function(co){
        var r=co.value[0].value.real; 
        var g=co.value[1].value.real; 
        var b=co.value[2].value.real; 
        if(csport.drawingstate.alpha==1){
            
            csport.drawingstate.linecolor="rgb("+Math.floor(r*255)+","
            +Math.floor(g*255)+","
            +Math.floor(b*255)+")";
            csport.drawingstate.linecolorraw=[r,g,b];
            csport.drawingstate.pointcolor="rgb("+Math.floor(r*255)+","
                +Math.floor(g*255)+","
                +Math.floor(b*255)+")";
        } else {
            csport.drawingstate.linecolor="rgb("+Math.floor(r*255)+","
            +Math.floor(g*255)+","
            +Math.floor(b*255)+","+csport.drawingstate.alpha+")";
            csport.drawingstate.linecolorraw=[r,g,b];
            csport.drawingstate.pointcolor="rgb("+Math.floor(r*255)+","
                +Math.floor(g*255)+","
                +Math.floor(b*255)+","+csport.drawingstate.alpha+")";
            
            
            
        }
        csport.drawingstate.pointcolorraw=[r,g,b];
        
    }

    csport.setlinecolor=function(co){
        var r=co.value[0].value.real; 
        var g=co.value[1].value.real; 
        var b=co.value[2].value.real; 
        if(csport.drawingstate.alpha==1){
            csport.drawingstate.linecolor=
            "rgb("+Math.floor(r*255)+","
            +Math.floor(g*255)+","
            +Math.floor(b*255)+")";
        } else{
            csport.drawingstate.linecolor=
            "rgba("+Math.floor(r*255)+","
            +Math.floor(g*255)+","
            +Math.floor(b*255)+","+csport.drawingstate.alpha+")";
        }
        csport.drawingstate.linecolorraw=[r,g,b];
    }
    
    csport.settextcolor=function(co){
        var r=co.value[0].value.real; 
        var g=co.value[1].value.real; 
        var b=co.value[2].value.real; 
        if(csport.drawingstate.alpha==1){
            csport.drawingstate.textcolor=
            "rgb("+Math.floor(r*255)+","
            +Math.floor(g*255)+","
            +Math.floor(b*255)+")";
        } else{
            csport.drawingstate.textcolor=
            "rgba("+Math.floor(r*255)+","
            +Math.floor(g*255)+","
            +Math.floor(b*255)+","+csport.drawingstate.alpha+")";
        }
        csport.drawingstate.textcolorraw=[r,g,b];
    }

    

    csport.setpointcolor=function(co){
        var r=co.value[0].value.real; 
        var g=co.value[1].value.real; 
        var b=co.value[2].value.real; 
        
        if(csport.drawingstate.alpha==1){
            csport.drawingstate.linecolor=
            "rgb("+Math.floor(r*255)+","
            +Math.floor(g*255)+","
            +Math.floor(b*255)+")";
        } else{
            csport.drawingstate.linecolor=
            "rgba("+Math.floor(r*255)+","
            +Math.floor(g*255)+","
            +Math.floor(b*255)+","+csport.drawingstate.alpha+")";
        }
        
        csport.drawingstate.pointcolorraw=[r,g,b];
        
    }

    csport.setalpha=function(al){
        var alpha=al.value.real;
        var r=csport.drawingstate.linecolorraw[0]; 
        var g=csport.drawingstate.linecolorraw[1]; 
        var b=csport.drawingstate.linecolorraw[2]; 
        
        csport.drawingstate.linecolor="rgba("+Math.floor(r*255)+","
            +Math.floor(g*255)+","
            +Math.floor(b*255)+","+alpha+")";
        
        var r=csport.drawingstate.pointcolorraw[0]; 
        var g=csport.drawingstate.pointcolorraw[1]; 
        var b=csport.drawingstate.pointcolorraw[2];                        
        csport.drawingstate.pointcolor="rgba("+Math.floor(r*255)+","
            +Math.floor(g*255)+","
            +Math.floor(b*255)+","+alpha+")";
 
        var r=csport.drawingstate.textcolorraw[0]; 
        var g=csport.drawingstate.textcolorraw[1]; 
        var b=csport.drawingstate.textcolorraw[2];                        
        csport.drawingstate.textcolor="rgba("+Math.floor(r*255)+","
            +Math.floor(g*255)+","
            +Math.floor(b*255)+","+alpha+")";
 
                      
        csport.drawingstate.alpha=alpha;
        
    }

    csport.setpointsize=function(si){
        csport.drawingstate.pointsize=si.value.real;
    }



    csport.setlinesize=function(si){
        csport.drawingstate.linesize=si.value.real;
    }

   csport.settextsize=function(si){
        csport.drawingstate.textsize=si.value.real;
    }
