//-----------------------------------------------------//
// CANVAS ELEMENTS
//-----------------------------------------------------//

function Background (r,g,b)
{
  ctx.beginPath();
  FillRGBA(r,g,b);

  ctx.rect(0,0, width,height);
  ctx.fill();
  ctx.stroke();
  ctx.closePath();
}

function Rect (x,y, w,h)
{
  ctx.beginPath();
  ctx.rect(x,y, w,h);
  ctx.fill();
  ctx.stroke();
  ctx.closePath();
}


//-----------------------------------------------------//
// BASIC DRAWING
//-----------------------------------------------------//

class ColorRGB
{
  constructor (r,g,b,a)
  {
    if (b != undefined)
    {
      this.r = r;
      this.g = r;
      this.b = r;
      this.a = g;
    }
    else
    {
      this.r = r;
      this.g = g;
      this.b = b;
      this.a = a;
    }

    this.col = Color (
      this.r,
      this.g,
      this.b,
      this.a
    );
  }
}


function FillRGBA (r,g,b,a)
{
  if (b != undefined)
  {
    ctx.fillStyle = Color(r,g,b,a);
  }
  else
  {
    ctx.fillStyle = Color(r,r,r,g);
  }
}
function FillCOL (col)
{
	ctx.fillStyle = col;
}
function Stroke (r,g,b,a)
{
  if (b != undefined)
  {
    ctx.strokeStyle = Color(r,g,b,a);
  }
  else { 
    ctx.strokeStyle = Color(r,r,r,g);
  }
}
function NoFill ()
{
  ctx.fillStyle = Color(0,0,0,0);
}
function NoStroke () 
{
  ctx.strokeStyle = Color(0,0,0,0);
}
function strokeWidth (width)
{
  ctx.lineWidth = width;
}


function Color (r,g,b,a)
{
    //returns in "rgba(r,g,b, a)" or "rgb(r,g,b)"
    if (a != undefined) return "rgba(" + [r, g, b, a].join(",") + ")";
    else return "rgb(" + [r, g, b].join(",") + ")";
}

function FillStroke (r,g,b,a)
{
  Fill(r,g,b,a);
  Stroke(r,g,b,a);
}


function ResetContext ()
{
  FillRGBA(255);
  Stroke(255);
  strokeWidth(1);
  ctx.moveTo(0,0);
  ctx.resetTransform();
}


//-----------------------------------------------------//
// MATH
//-----------------------------------------------------//

function random (min, max)
{
	if (max == undefined)
	{
		return Math.random() * min;
	}

	return min + Math.random() * max;
}