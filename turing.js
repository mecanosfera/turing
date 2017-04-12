var Registrer = function(configurations, tape_symbols) {
	var me = this;

	me.div = $("#state");
	var tp_symbols = [ '', '', '', '', '', '', '', '', '', '' ];
	if (tape_symbols != null) {
		tp_symbols = tape_symbols;
	}
	me.tape = new Tape(me, tp_symbols);
	me.speed = 100;
	me.configurations = configurations;

	me.end_configuration = function() {
		me.operations.td_final_m_conf.addClass("ativo");
		if (me.operations.final_m_conf != ''
				&& me.configurations.get(me.operations.final_m_conf) != null) {
			window.setTimeout(function() {
				me.configuration.td_m_conf.removeClass("ativo");
				me.operations.td_final_m_conf.removeClass("ativo");
				// alert(me.configurations.get(me.state.final_m_conf()));
				me.execute_configuration(me.configurations.get(me.operations
						.final_m_conf));
			}, me.speed);
		}
	};

	me.execute_configuration = function(config) {
		me.configuration = config;
		me.operations = me.configuration.get_operation(me.tape.scanned_symbol());
		me.m_conf = me.configuration.m_conf;
		//alert(me.m_conf);
		me.div.html(me.m_conf+":"+me.tape.scanned_symbol());
		me.div.addClass("ativo");
		me.configuration.td_m_conf.addClass("ativo");
		window.setTimeout(function() {
			if (me.operations != null) {
				me.operations.td_symbol.addClass("ativo");
				window.setTimeout(function() {
					me.operations.td_symbol.removeClass("ativo");
					me.next_operation(0);
				}, me.speed);
			}
		}, me.speed);
	};

	me.next_operation = function(op) {
		
		if (me.operations.operation!=null && me.operations.operation[op]!=null) {
			var opr = me.operations.operation[op];
			me.operations.td_operation.addClass("ativo");
			if (opr == "L") {
				me.tape.left();
			} else if (opr == "R") {
				me.tape.right();
			} else if (opr == "E") {
				me.tape.erase();
			} else {state
				me.tape.write(opr);
			}
			window.setTimeout(function() {
				me.next_operation(op + 1);
			}, me.speed);
		} else {
			window.setTimeout(function() {
				me.operations.td_operation.removeClass("ativo");
				me.end_configuration();
			}, me.speed);
		}
	};

	me.start = function() {
		me.execute_configuration(me.configurations.configurations[0]);
	};
};

var Tape = function(registrer, starting_symbols) {

	var me = this;
	me.ul = $("#tape");
	me.registrer = registrer;

	me.squares = [];

	symbols = [ 'z', 'z' ];

	if (starting_symbols != null) {
		symbols = starting_symbols;
	}
	for (i = 0; i < symbols.length; i++) {
		me.squares.push(new Square(i, symbols[i], me));
	}

	me.start = me.squares[0];
	me.scanned_square = me.start;
	me.actualIndex = 0;
	me.startPosition = 82;
	me.position = me.startPosition;
	me.ul.css('margin-left', me.position + 'px');

	me.right = function() {
		me.actualIndex++;
		if (me.squares[(me.actualIndex + 9)] == null) {
			me.squares.push(new Square((me.actualIndex + 9), '', me));
		}
		me.scanned_square = me.squares[me.actualIndex];

		me.position -= 41;
		me.ul.animate({
			'margin-left' : '-=41'
		}, (me.registrer.speed - 10));
		return true;
	};

	me.left = function() {
		if (me.actualIndex > 0) {

			me.position += 41;
			me.ul.animate({
				'margin-left' : '+=41'
			}, (me.registrer.speed - 10));
			me.actualIndex--;
			me.scanned_square = me.squares[me.actualIndex];
			return true;
		}
		return false;
	};

	me.write = function(symbol) {
		me.scanned_square.write(symbol);
	};

	me.erase = function() {
		me.scanned_square.write('');
	};

	me.scanned_symbol = function() {
		return me.scanned_square.symbol;
	};

};

var Square = function(index, symbol, tape) {

	var me = this;

	me.index = index;
	me.symbol = symbol;
	me.tape = tape;
	me.isActive = false;

	me.li = $('<li>' + me.symbol + '</li>');
	me.tape.ul.append(me.li);

	me.write = function(symbol) {
		me.symbol = symbol;
		me.li.html(me.symbol);
	};

};

var ConfigurationTable = function(confs) {

	var me = this;

	me.configurations = [];
	me.table = $("#configurations");

	if (confs != null) {
		for (i in confs) {
			me.configurations.push(new Configuration(me, confs[i]));
		}
	} else {
		me.configurations.push(new Configuration(me, [ 'q1',
				[ [ '', 'x,L,R', 'q2' ] ] ]));
	}

	me.get = function(gm_conf) {
		for (c in me.configurations) {
			if (me.configurations[c].m_conf == gm_conf) {
				return me.configurations[c];
			}
		}
		return null;
	};

	me.add = function() {
		me.configurations.push(new Configuration(me));
	};
};

var Configuration = function(confTable, vals) {

	var me = this;
	me.c_table = confTable;
	me.m_conf = vals[0];
	me.groups = vals[1];

	me.operations = [];
	
	me.td_m_conf = null;
	for (i in me.groups) {
		var g = me.groups[i];
		var opr = null;
		if(g[1]!=''){
			opr = g[1].split(',');
		}
		var op = {
			'tr' : $('<tr></tr>'),
			'td_symbol' : $('<td class="c-symbol">' + g[0] + '</td>'),
			'td_operation' : $('<td class="c-operation">' + g[1] + '</td>'),
			'td_final_m_conf' : $('<td class="c-final_m_conf">' + g[2]
					+ '</td>'),
			'symbol' : g[0],
			'operation' : opr,
			'final_m_conf' : g[2]
		};
		me.operations.push(op);
		if (me.td_m_conf == null) {
			me.td_m_conf = $('<td class="c-m_conf" rowspan="'
					+ me.groups.length + '">' + me.m_conf + '</td>');
			op["tr"].append(me.td_m_conf);
		}
		op["tr"].append(op["td_symbol"]);
		op["tr"].append(op["td_operation"]);
		op["tr"].append(op["td_final_m_conf"]);
		me.c_table.table.append(op["tr"]);
	}
	
	me.get_operation = function(symbol){
		for(i in me.operations){
			if(me.operations[i].symbol==symbol){
				return me.operations[i];
			}
		}
		return null;
	}

}

var TuringMachine = function(program, start) {
	var me = this;
	me.reg = new Registrer(new ConfigurationTable(program), start);
	me.start = function() {
		me.reg.start();
	}
};

$(document).ready(
		function() {
			var tm = new TuringMachine([ 
			        ['b',[ 
			               ['','z,R,z,R,0,R,R,0,L,L','d']
			              ]],
			        ['d',[
			              ['1','R,x,L,L,L','d'],
			              ['0','','q']
			              ]],
			        ['q',[
			              ['0','R,R','q'],
			              ['1','R,R','q'],
			              ['','1,L','p']
			              ]],
		            ['p',[
		                  ['x','E,R','q'],
		                  ['z','R','f'],
		                  ['','L,L','p']
		                  ]],
		            ['f',[
		                  ['0','R,R','f'],
		                  ['1','R,R','f'],
		                  ['x','R,R','f'],
		                  ['z','R,R','f'],
		                  ['','0,L,L','d']
		                  ]]
			        ]);
			// tape.left();

			$("#left").click(tm.start);

			$("#add").click(tm.reg.configurations.add);

		});

