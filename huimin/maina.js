var nHNumber=15;
var nVNumber=25;
var nSizeWidth = 10;
var nSizeHeigth = 6;
var nMaxCom = 7;
var nScore = 0;
var DifficultyLag = 340;//difficulty linearly related to score //astronaut bonus
var GameCanvas = document.getElementById("Game-Canvas");
var GameCanvasContext = GameCanvas.getContext("2d");
var BackgroundAudioPlayer = document.getElementById("Background-AudioPlayer");
var rushBlock = new Tetris();
var GameStatus = 0;//1=start 0=stop
var TotalLine = 0;
var havegame = 0;

function GameStart() 
{
    GameCanvasContext.clearRect(0, 0, nHNumber * nSizeWidth, nVNumber * nSizeHeigth);
    Lines = 0;
    nScore = 0;
    GameStatus = 1;
    DifficultyLag = 340;
    rushBlock.NewNextCom();
    rushBlock.NextComToCurrentCom();
    rushBlock.NewNextCom();
    BackgroundAudioPlayer.load();
    BackgroundAudioPlayer.play();
    document.getElementById("Game-Score").innerText=nScore;
    document.getElementById("Total-Lines").innerText=TotalLine;
    document.getElementById("Button-Game-Switch").innerText="End";
    havegame = 1;
    GameTimer();
}

function GameEnd()
{
    GameStatus = 0;
    havegame = 0;
    document.getElementById("Button-Game-Switch").innerText="New Game";
	for (var i=0;i<nHNumber;i++)
	{
		for (var j=0;j<nVNumber;j++)
		{
			rushBlock.aState[i][j]=0;
		}
	}
}

function GameSwitch()
{
    if (GameStatus == 0)
    {
        GameStart();
    }
    else
    {
        GameEnd();
    }
    document.getElementById("Button-Game-ChangeState").innerText = "Pause";
}

function GamePause()
{
    GameStatus = 0;
}

function GameResume()
{
    GameStatus = 1;
    GameTimer();
}

function GameChangeState()
{
    if (havegame)
    {
    if (GameStatus == 0)
    {
        document.getElementById("Button-Game-ChangeState").innerText = "Pause";
        GameResume();
    }
    else
    {
        document.getElementById("Button-Game-ChangeState").innerText = "Resume";
        GamePause();
    }
    }
}

function GameTimer()
{
    var nDimension = rushBlock.CurrentCom.nDimension;
    if (rushBlock.CanDown(1))
    {
        rushBlock.NullifyRect(rushBlock.ptIndex, nDimension);
        rushBlock.ptIndex.Y++;
    }
    else
    {
        for (var i = 0; i < nDimension * nDimension; i++) 
        {
            if (rushBlock.CurrentCom.ptrArray[i] == 1)
            {
                var xCoordinate = rushBlock.ptIndex.X + i % nDimension;
                var yCoordinate = rushBlock.ptIndex.Y + (i - (i % nDimension)) / nDimension;
                rushBlock.aState[xCoordinate][yCoordinate] = 1;
            }
        }
        rushBlock.NullifyRect();
        rushBlock.Eliminate();
        if (rushBlock.CheckFail()) 
        {
            rushBlock.nCurrentComID = -1;
            GameEnd();
        }
        else 
        {
            rushBlock.NextComToCurrentCom();
            rushBlock.NewNextCom();
        }
    }
    DrawGame();
    if (GameStatus) setTimeout("GameTimer()", DifficultyLag);
}

function DrawGame()
{
    
    GameCanvasContext.moveTo(nHNumber*nSizeWidth,0);
    GameCanvasContext.lineTo(nHNumber*nSizeWidth,nVNumber*nSizeHeigth);
    GameCanvasContext.stroke();
    
    GameCanvasContext.fillStyle = "blue";
    for (var i = 0; i < nHNumber; i++)
    {
        for (var j = 0; j < nVNumber; j++)
        {
            if (rushBlock.aState[i][j] == 1)
            {
                GameCanvasContext.fillRect(i * nSizeWidth, j * nSizeHeigth, nSizeWidth, nSizeHeigth);
            }
        }
    }
    GameCanvasContext.fillStyle = "red";
    
    if (rushBlock.CurrentCom.nComID >= 0)
    {
        var nDimension = rushBlock.CurrentCom.nDimension;
        for (var i = 0; i < nDimension * nDimension; i++)
        {
            if(rushBlock.CurrentCom.ptrArray[i] == 1)
            {
                var xCoordinate = rushBlock.ptIndex.X + i % nDimension;
                var yCoordinate = rushBlock.ptIndex.Y + (i - (i %nDimension)) / nDimension;
                GameCanvasContext.fillRect(xCoordinate * nSizeWidth, yCoordinate * nSizeHeigth, nSizeWidth, nSizeHeigth);
            }
        }
    }
    
    var nNextComDimenion = rushBlock.NextCom.nDimension;
    GameCanvasContext.clearRect((nHNumber+3)*nSizeWidth,10*nSizeHeigth,4*nSizeWidth,4*nSizeHeigth);
    for (var i = 0; i < nNextComDimenion * nNextComDimenion; i++)
    {
        if (rushBlock.NextCom.ptrArray[i] == 1) {
            var xCoordinate = nHNumber + i % nNextComDimenion+3;
            var yCoordinate = 10 + (i - i % nNextComDimenion) / nNextComDimenion;
            GameCanvasContext.fillRect(xCoordinate * nSizeWidth, yCoordinate * nSizeHeigth, nSizeWidth, nSizeHeigth);
        }
    }
}

function tagComponent()
{
    this.nComID = null;//id
    this.nDimension = null;//存储该部件所需的数组维数
    this.ptrArray = null;//指向存储该部件的数组
}

function Tetris()
{
   
    this.nCurrentComID = null;
    this.aState = new Array(nHNumber);
    for (var i = 0; i < nHNumber; i++)
    {
        this.aState[i] = new Array(nVNumber);
        for (var j = 0; j < nVNumber; j++) this.aState[i][j] = 0;
    }


    this.aComponents = new Array(nMaxCom);
    for (var i = 0; i < nMaxCom; i++) this.aComponents[i] = new tagComponent();
    
    //init
    //0
    this.aComponents[0].nComID=0;
    this.aComponents[0].nDimension=2;
    this.aComponents[0].ptrArray=new Array(4);
    for(var i=0;i<4;i++)
    {
		this.aComponents[0].ptrArray[i]=1;
    }
        //方块


        //1
	this.aComponents[1].nComID=1;
    this.aComponents[1].nDimension=3;
    this.aComponents[1].ptrArray=new Array(9);
    this.aComponents[1].ptrArray[0]=0;
    this.aComponents[1].ptrArray[1]=1;
    this.aComponents[1].ptrArray[2]=0;
    this.aComponents[1].ptrArray[3]=1;
    this.aComponents[1].ptrArray[4]=1;
    this.aComponents[1].ptrArray[5]=1;
    this.aComponents[1].ptrArray[6]=0;
    this.aComponents[1].ptrArray[7]=0;
    this.aComponents[1].ptrArray[8]=0;
    // T型

    //2
    this.aComponents[2].nComID=2;
    this.aComponents[2].nDimension=3;
    this.aComponents[2].ptrArray = new Array(9);
    this.aComponents[2].ptrArray[0]=1;
    this.aComponents[2].ptrArray[1]=0;
    this.aComponents[2].ptrArray[2]=0;
    this.aComponents[2].ptrArray[3]=1;
    this.aComponents[2].ptrArray[4]=1;
    this.aComponents[2].ptrArray[5]=0;
    this.aComponents[2].ptrArray[6]=0;
    this.aComponents[2].ptrArray[7]=1;
    this.aComponents[2].ptrArray[8]=0;
    // _|-扭曲型


    //3
    this.aComponents[3].nComID=3;
    this.aComponents[3].nDimension=3;
    this.aComponents[3].ptrArray = new Array(9);
    this.aComponents[3].ptrArray[0]=0;
    this.aComponents[3].ptrArray[1]=0;
    this.aComponents[3].ptrArray[2]=1;
    this.aComponents[3].ptrArray[3]=0;
    this.aComponents[3].ptrArray[4]=1;
    this.aComponents[3].ptrArray[5]=1;
    this.aComponents[3].ptrArray[6]=0;
    this.aComponents[3].ptrArray[7]=1;
    this.aComponents[3].ptrArray[8]=0;
    // -|_扭曲型


    //4
    this.aComponents[4].nComID=4;
    this.aComponents[4].nDimension=3;
    this.aComponents[4].ptrArray = new Array(9);
    this.aComponents[4].ptrArray[0]=1;
    this.aComponents[4].ptrArray[1]=0;
    this.aComponents[4].ptrArray[2]=0;
    this.aComponents[4].ptrArray[3]=1;
    this.aComponents[4].ptrArray[4]=1;
    this.aComponents[4].ptrArray[5]=1;
    this.aComponents[4].ptrArray[6]=0;
    this.aComponents[4].ptrArray[7]=0;
    this.aComponents[4].ptrArray[8]=0;
    // |__L型


    //5
    this.aComponents[5].nComID=5;
    this.aComponents[5].nDimension=3;
    this.aComponents[5].ptrArray = new Array(9);
    this.aComponents[5].ptrArray[0]=0;
    this.aComponents[5].ptrArray[1]=0;
    this.aComponents[5].ptrArray[2]=1;
    this.aComponents[5].ptrArray[3]=1;
    this.aComponents[5].ptrArray[4]=1;
    this.aComponents[5].ptrArray[5]=1;
    this.aComponents[5].ptrArray[6]=0;
    this.aComponents[5].ptrArray[7]=0;
    this.aComponents[5].ptrArray[8]=0;
    // __|L型

    //6
    this.aComponents[6].nComID=6;
    this.aComponents[6].nDimension=4;
    this.aComponents[6].ptrArray = new Array(16);
    this.aComponents[6].ptrArray[0]=0;
    this.aComponents[6].ptrArray[1]=0;
    this.aComponents[6].ptrArray[2]=0;
    this.aComponents[6].ptrArray[3]=1;
    this.aComponents[6].ptrArray[4]=0;
    this.aComponents[6].ptrArray[5]=0;
    this.aComponents[6].ptrArray[6]=0;
    this.aComponents[6].ptrArray[7]=1;
    this.aComponents[6].ptrArray[8]=0;
    this.aComponents[6].ptrArray[9]=0;
    this.aComponents[6].ptrArray[10]=0;
    this.aComponents[6].ptrArray[11]=1;
    this.aComponents[6].ptrArray[12]=0;
    this.aComponents[6].ptrArray[13]=0;
    this.aComponents[6].ptrArray[14]=0;
    this.aComponents[6].ptrArray[15]=1;
    //长条型
    
    this.CurrentCom = new tagComponent();
    this.NextCom = new tagComponent();
    this.ptIndex = new Point(0,0);
    


    //产生一个新部件到NextCom
    this.NewNextCom = function () 
    {
        //这样产生出来的长条形就会少一些，增大游戏难度..
        var nComID = Math.round(Math.random() * 6);
        this.NextCom.nComID = nComID;
        var nDimension = this.aComponents[nComID].nDimension;
        this.NextCom.nDimension = nDimension;
        this.NextCom.ptrArray = new Array(nDimension * nDimension);
        for (var i=0;i<nDimension * nDimension;i++) 
        {
            this.NextCom.ptrArray[i] = this.aComponents[nComID].ptrArray[i];
        }
    }


    this.NextComToCurrentCom = function () 
    {
        this.CurrentCom.nComID = this.NextCom.nComID;
        this.nCurrentComID = this.CurrentCom.nComID;
        this.CurrentCom.nDimension = this.NextCom.nDimension;
        var nDimension = this.CurrentCom.nDimension;
        this.CurrentCom.ptrArray = new Array(nDimension * nDimension);
        for (var i=0; i<nDimension*nDimension;i++) 
        {
            this.CurrentCom.ptrArray[i] = this.NextCom.ptrArray[i];
        }
        this.ptIndex.X = 9;
        this.ptIndex.Y = -1;

        if (this.CanNew()==false) 
        {
            this.nCurrentComID = -1;
            GameEnd();
        }
    }

    this.CanDown = function (nNumber) 
    {
        var bDown = true;
        var ptNewIndex = new Point(this.ptIndex.X, this.ptIndex.Y);
        ptNewIndex.Y+=nNumber;
        var nDimension = this.CurrentCom.nDimension;
        for (var i = 0; i < nDimension * nDimension; i++) 
        {
            if (this.CurrentCom.ptrArray[i] == 1) 
            {
                var xCoordinate = ptNewIndex.X + i % nDimension;
                var yCoordinate = ptNewIndex.Y + (i - (i % nDimension)) / nDimension;
                if (yCoordinate >= nVNumber || this.aState[xCoordinate][yCoordinate] == 1) 
                {
                    bDown = false;
                }
            }
        }
        ptNewIndex = null;
        return bDown;
    }
    //是否可以左移
    this.Left = function () 
    {
        var bLeft = true;
        var nDimension = this.CurrentCom.nDimension;
        var ptNewPoint = new Point(this.ptIndex.X,this.ptIndex.Y);
        ptNewPoint.X--;
        for (var i = 0; i < nDimension * nDimension; i++) 
        {
            if (this.CurrentCom.ptrArray[i] == 1)
             {
                var xCoordinate = ptNewPoint.X + i % nDimension;
                var yCoordinate = ptNewPoint.Y + (i - (i % nDimension)) / nDimension;
                if (xCoordinate <0 || this.aState[xCoordinate][yCoordinate] == 1) 
                {
                    bLeft = false;
                }
            }
        }
        ptNewPoint = null;
        if (bLeft)
            this.ptIndex.X--;
    }
    //是否可以右移
    this.Right = function ()
    {
        var bRight = true;
        var nDimension = this.CurrentCom.nDimension;
        var ptNewIndex = new Point(this.ptIndex.X, this.ptIndex.Y);
        ptNewIndex.X++;
        for (var i = 0; i < nDimension * nDimension; i++)
        {
            if (this.CurrentCom.ptrArray[i] == 1)
            {
                var xCoordinate = ptNewIndex.X + i % nDimension;
                var yCoordinate = ptNewIndex.Y + (i - (i % nDimension)) / nDimension;
                if (xCoordinate>=nHNumber|| this.aState[xCoordinate][yCoordinate] == 1)
                {
                    bRight = false;
                }
            }
        }
        ptNewIndex = null;
        if (bRight)
        {
            this.ptIndex.X++;
        }
    }
    //是否可以旋转
    this.Rotate = function ()
    {
        var bRotate = true;
        var nDimension = this.CurrentCom.nDimension;
        var ptNewIndex = new Point(this.ptIndex.X, this.ptIndex.Y);
        var ptrNewCom = new Array(nDimension * nDimension);
        for(var i=0;i<nDimension*nDimension;i++)
        {
            var row = (i-i%nDimension) / nDimension;
            var column = i % nDimension;
            var newIndex=column * nDimension + (nDimension - row - 1);
            ptrNewCom[newIndex] = rushBlock.CurrentCom.ptrArray[i];
            if (ptrNewCom[newIndex] == 1)
            {
                var xCoordinate = ptNewIndex .X+ newIndex % nDimension;
                var yCoordinate = ptNewIndex.Y +( newIndex - newIndex % nDimension )/ nDimension;
                if (xCoordinate < 0 || this.aState[xCoordinate][yCoordinate] == 1 || xCoordinate >= nHNumber || yCoordinate >= nVNumber)
                {
                    bRotate = false;
                }
            }
        }
        if (bRotate)
        {
            for (var i = 0; i < nDimension * nDimension; i++)
            {
                this.CurrentCom.ptrArray[i] = ptrNewCom[i];
            }
        }
        ptNewIndex = null;
        ptrNewCom = null;
    }

    this.Accelerate = function () 
    {
        if (this.CanDown(3))
        {
            this.ptIndex.Y += 3;
        }
    }
    //检查是否有足够的空位显示新的部件，否则游戏结束
    this.CanNew = function ()
    {
        var bNew = true;
        var nDimension = this.CurrentCom.nDimension;
        var ptNewIndex = new Point(this.ptIndex.X, this.ptIndex.Y);
        for (var i = 0; i < nDimension * nDimension; i++)
        {
            if (this.CurrentCom.ptrArray[i] == 1)
            {
                var xCoordinate = ptNewIndex.X + i % nDimension;
                var yCoordinate = ptNewIndex.Y +( i - i % nDimension) / nDimension;
                if (this.aState[xCoordinate][yCoordinate] == 1)
                {//被挡住
                    bNew = false;
                }
            }
        }
        ptNewIndex = null;
        return bNew;
    }
    //消去行
    this.Eliminate = function ()
    {
        var nLine = 0;
        for (var i = nVNumber - 1; i >= 0; i--)
        {
            var bLine = true;
            for (var j = 0; j < nHNumber; j++)
            {
                if (this.aState[j][i] == 0)
                    bLine = false;
            }

            if (bLine)
            {
                //可以消
                nLine++;
                for (var j = i; j > 0; j--)
                {
                    for (var k = 0; k < nHNumber; k++)
                    {
                        this.aState[k][j] = this.aState[k][j - 1];
                    }
                }
                for (var j = 0; j < nHNumber; j++)
                {
                    this.aState[j][0] = 0;
                }
                i++;
                GameCanvasContext.clearRect(0,0,nHNumber*nSizeWidth,nVNumber*nSizeHeigth);
            }
        }
        if (nLine)
        {
            nScore += nLine * (nLine + 1) * 2.5;//5/15/30/50
            TotalLine += nLine;
            DifficultyLag = 340 - TotalLine * 1.8;//astronaut bonus
            document.getElementById("Game-Score").innerText=nScore;
            document.getElementById("Total-Lines").innerText=TotalLine;
            if (nScore >= 200)
            {
                document.getElementById("Hint1").innerText="The Number is a multiple of 26!";
            }
            if (nScore >= 500)
            {
                document.getElementById("Hint2").innerText="The Number is the product of 26 and 7B!";
            }
            if (nScore >= 800)
            {
                document.getElementById("Hint3").innerText="The 7B above is in hexadecimal! :)";
                document.getElementById("BWish").innerHTML="<a href='birthdaywish12347.html'>Click to view your birthday wish! :)</a>";
            }
        }
        //显示得分
    }
    //刷新游戏界面
    //删除部件旧区域
    this.NullifyRect = function ()
    {
        GameCanvasContext.clearRect(this.ptIndex.X*nSizeWidth-1,this.ptIndex.Y*nSizeHeigth-1,(this.CurrentCom.nDimension)*nSizeWidth+1.5,(this.CurrentCom.nDimension)*nSizeWidth+1);//好像有点问题，有时会有小bug，算了懒得找
    }
    //判断游戏是否结束
    this.CheckFail = function ()
    {
        var bEnd = false;
        for (var i = 0; i < nHNumber; i++)
        {
            if (this.aState[i][0] == 1)
            {
                bEnd = true;
            }
        }
        return bEnd;
    }
    

}


function Point(x, y)
{
    this.X= x;
    this.Y= y;
}


function Action(event) 
{
    var nDimension = rushBlock.CurrentCom.nDimension;
    rushBlock.NullifyRect();
        switch (event.keyCode) 
        {
            case 37://left
            {
                if (GameStatus == 1) rushBlock.Left();
                break;
            }
            case 38://顺时针旋转
            {
                if (GameStatus == 1) rushBlock.Rotate();
                break;
            }
            case 39://right
            {
                if (GameStatus == 1) rushBlock.Right();
                break;
            }
            case 40:
            {
                if (GameStatus == 1) rushBlock.Accelerate();
                break;
            }
        }
    GameCanvasContext.fillStyle = "red";
    //显示新位置
    for (var i = 0; i < nDimension * nDimension; i++)
    {
        if (rushBlock.CurrentCom.ptrArray[i] == 1)
        {
            var xCoordinate = rushBlock.ptIndex.X + i % nDimension;
            var yCoordinate = rushBlock.ptIndex.Y + (i - i % nDimension) / nDimension;
            GameCanvasContext.fillRect(xCoordinate*nSizeWidth,yCoordinate*nSizeHeigth,nSizeWidth,nSizeHeigth);
        }
    }
}

