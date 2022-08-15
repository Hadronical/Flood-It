let canvas = document.getElementById("gamecanvas");
let ctx = canvas.getContext("2d");
ctx.font = "50px Arial";


const width = canvas.width;
const height = canvas.height;


function pair (a, b)
{
	this.first = a;
	this.second = b;

	this.equals = (other) => {
		return (this.first == other.first && this.second == other.second);
	}
}

let size = 16;
let gridbase = "";
let grid = new Array(size).fill(0).map(_ => new Array(size).fill(0));
let visited = new Array(size).fill(0).map(_ => new Array(size).fill(false));

let gSize;
let gSpace = 1.5;

const COLORS = [
	Color(250,250,40),
	Color(40,200,40),
	Color(250,40,40),
	Color(40,40,250),
	Color(160,40,200),
	Color(240,120,40)
];

let currentColor = 0;
let currentSelection = new Array(size).fill(0).map(_ => new Array(size).fill(false));
let currentSelected = [];

let updated  = false,
	complete = false,
	playing  = true,
	flooding = false;


let moves = 0;
let maxmoves = 25;

let txt_moves = document.getElementById("txt_moves");


setup();
draw();


function setup()
{
	GRID_setSize();

	NoStroke();
	let button;
	for (let i = 0; i < 6; i++)
	{
		button = document.getElementById("key_" + (i + 1));
		button.onclick = () => { ChangeColor(i); }
		button.style.background = COLORS[i];
	}

	ResetContext();

	NewGame();
}

function draw ()
{ requestAnimationFrame(draw);

	if (!playing) { return; }

	if (!updated)
	{
		GRID_draw();
		updated = true;
	}

	// floodfill animation
	if (currentSelected.length > 0)
	{
		let l = currentSelected.length;

		for (let i = 0; i < l; i++)
		{
			let p = currentSelected[i];
			let x = p.first;
			let y = p.second;

			grid[y][x] = currentColor;
			currentSelection[y][x] = false;

			// select next tiles for filling next frame
			let temp = [
				new pair(x - 1, y), new pair(x + 1, y),
				new pair(x, y - 1), new pair(x , y + 1)
			]
			temp.forEach(p => {
				let x = p.first;
				let y = p.second;
				if (x < 0 || x >= size || y < 0 || y >= size) { return; }
				if (currentSelection[y][x])
				{
					currentSelection[y][x] = false;
					currentSelected.push(p);
				}
			});
		}

		currentSelected.splice(0, l);

		updated = false;
	}
	else if (flooding)
	{
		currentSelected = [];

		flooding = false;
		GRID_checkComplete();
	}

	if (moves >= maxmoves && !complete)
	{
		FillRGBA(250,80,80, 200);
		ctx.fillText("You Lost!", width/2 - 100, height/2);
		playing = false;
	}
	else if (complete)
	{
		FillRGBA(80,250,80, 200);
		ctx.fillText("You Win!", width/2 - 100, height/2);
	}

	txt_moves.innerHTML = "moves: " + moves + "/" + maxmoves;

	playing = !complete;
}


function NewGame ()
{
	GRID_setSize();

	let temp = [];
	for (let y = 0; y < size; y++)
	{
		let row = [];
		for (let x = 0; x < size; x++)
		{
			row.push( Math.floor(random(0, 6)) );
		}
		temp.push(row);
	}
	
	gridbase = JSON.stringify(temp);

	Restart();
}
function Restart ()
{
	GRID_fromString(gridbase);

	currentSelected = [];

	moves = 0;

	previousCnt = 0;
	currentCnt = 0;

	updated = false;
	complete = false;
	playing = true;
}

function SaveGame ()
{
	let savegrid = GRID_toString();
	localStorage.setItem("savebase", gridbase);
	localStorage.setItem("savegrid", savegrid);
}
function LoadSave ()
{
	let savebase = localStorage.getItem("savebase");
	let savegrid = localStorage.getItem("savegrid");

	if (savebase != null)
	{
		gridbase = savebase;
	}
	if (savegrid != null)
	{
		GRID_fromString(savegrid);
	}

	updated = false;
}

function GRID_setSize (s)
{
	let inp_size = document.getElementById("inp_size");
	size = parseInt(inp_size.value);
	gSize = (width - gSpace * size) / size;

	switch (size)
	{
		case 6: maxmoves = 15; break;
		case 10: maxmoves = 20; break;
		case 14: maxmoves = 25; break;
		case 16: maxmoves = 28; break;
		case 24: maxmoves = 36; break;
	}
}
function GRID_fromString (s)
{
	grid = JSON.parse(s);
}
function GRID_toString ()
{
	return JSON.stringify(grid);
}

function GRID_draw ()
{
	Background(60);

	ResetContext();
	NoStroke();
	for (let y = 0; y < size; y++)
	for (let x = 0; x < size; x++)
	{{
		FillCOL(COLORS[grid[y][x]]);
		if (currentSelection[y][x])
		{
			FillRGBA(0,255,255, 200);
		}
		let X = x * (gSize + gSpace);
		let Y = y * (gSize + gSpace);
		Rect(X,Y, gSize,gSize);
	}}
	ResetContext();
}
function GRID_checkComplete ()
{
	let v = grid[0][0];

	for (let y = 0; y < size; y++)
	for (let x = 0; x < size; x++)
	{{
		complete = false;
		if (grid[y][x] != v) return false;
	}}

	console.log("you win!");
	complete = true;
	return true;
}


function FloodSelect (x, y)
{
	if (x < 0 || x >= size || y < 0 || y >= size) { return; }
	if (visited[y][x]) { return; }
	if (grid[y][x] != grid[0][0]) { return; }

	currentSelection[y][x] = true;
	currentCnt++;
	visited[y][x] = true;

	FloodSelect(x - 1, y);
	FloodSelect(x + 1, y);
	FloodSelect(x, y - 1);
	FloodSelect(x, y + 1);
}
function ChangeColor (v)
{
	if (!playing) { return; }

	visited = [];
	currentSelection = [];
	for (let i = 0; i < size; i++)
	{
		visited.push( new Array(size).fill(false) );
		currentSelection.push( new Array(size).fill(false) );
	}

	currentSelected.push( new pair(0, 0) );

	FloodSelect(0, 0);

	currentSelection[0][0] = true;

	currentColor = v;
	moves++;
	flooding = true;
}