// Each row authors a rescue route, not a generated label over one fixed puzzle.
window.LANTERN_TRAILS=[
 ['same','0'],['same','12'],['same','20'],['same','102'],['next','012'],
 ['next','10'],['next','202'],['next','120'],['next','021'],['previous','210'],
 ['previous','02'],['previous','121'],['previous','210'],['previous','102'],['missing','012'],
 ['missing','10'],['missing','202'],['missing','120'],['missing','021'],['blocked','210'],
 ['blocked','02'],['blocked','121'],['blocked','210'],['blocked','102'],['weather','012'],
 ['weather','102'],['weather','201'],['mixed','1201'],['mixed','2012'],['finale','01210']
].map(([rule,signals],i)=>({number:i+1,chapter:Math.floor(i/5),checkpoint:(i+1)%5===0,rule,signals:[...signals].map(Number)}));
