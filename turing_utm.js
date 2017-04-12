var Registrer = function(inst_table, tape_symbols, skeleton) {
	var me = this;

	me.div = $("#state");
	var tp_symbols = [ '', '', '', '', '', '', '', '', '', '' ];
	if (tape_symbols != null) {
		tp_symbols = tape_symbols;
	}
	me.tape = new Grid(me, tp_symbols);
	me.speed = 10;
	me.inst_table = inst_table;
	me.skeleton = skeleton;

	me.end_configuration = function() {

		me.operations.td_final_m_conf.addClass("ativo");
		if (me.operations.final_m_conf != '') {
			// alert(me.configuration.m_conf+':'+me.operations.symbol);
			var next_conf = me.inst_table.get(me.operations);
			if (next_conf != null) {
				// alert(me.operations.final_m_conf);

				// alert(next_conf.m_conf+' -
				// '+next_conf.operations[0].final_m_conf);

				window.setTimeout(function() {
					me.configuration.td_m_conf.removeClass("ativo");
					me.operations.td_final_m_conf.removeClass("ativo");
					// alert(me.configurations.get(me.state.final_m_conf()));
					// alert(me.operations.final_m_conf+'->'+next_conf.m_conf+'('+next_conf.params+')');
					me.execute_configuration(next_conf);
				}, me.speed);
			}
		}
	};

	me.execute_configuration = function(config) {
		me.configuration = config;
		me.operations = me.configuration
				.get_operation(me.tape.scanned_symbol());
		me.m_conf = me.configuration.m_conf;
		// alert(me.m_conf);
		me.div.html(me.m_conf + ":" + me.tape.scanned_symbol());
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
		if (me.operations.operation != null
				&& me.operations.operation[op] != null) {
			var opr = me.operations.operation[op];
			me.operations.td_operation.addClass("ativo");
			if (opr == "L") {
				me.tape.left();
			} else if (opr == "R") {
				me.tape.right();
			} else if (opr == "E") {
				me.tape.erase();
			} else {
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

	me.run = function(table, start) {
		me.inst_table = table;
		if (start != null) {
			me.tape.set_symbols(start);
		}
		me.start();
	}

	me.start = function() {
		me.execute_configuration(me.inst_table.configurations[0]);
	};
};

var Tape = function(registrer, starting_symbols) {
	var me = this;
	me.ul = $("#tape");
	me.registrer = registrer;
	//$("#registrer").css('display','none');

	me.squares = [];

	symbols = [ 'z', 'z' ];

	if (starting_symbols != null) {
		symbols = starting_symbols;
	}

	me.set_symbols = function(sym) {
		me.ul.html('');
		var bd = (sym.length * 41) + 700;
		$('body').css('width', bd + 'px');
		// $('#machine_wrapper').css('width',bd+'px');
		for (i = 0; i < sym.length; i++) {
			me.squares.push(new Square(i, sym[i], me));

		}
		me.set_start_position();
	};

	me.set_start_position = function() {
		me.start = me.squares[0];
		me.scanned_square = me.start;
		me.actualIndex = 0;
		me.startPosition = 246;
		me.position = me.startPosition;
		me.ul.css('margin-left', me.position + 'px');
		// $('body').css('width',1400+'px');
	};

	me.set_symbols(symbols);

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

var Grid = function(registrer,starting_symbols){
	var me = this;
	me.ul = $("#grid");
	me.registrer = registrer;

	me.squares = [];

	symbols = [ '@', '@' ];

	if (starting_symbols != null) {
		symbols = starting_symbols;
	}

	me.set_symbols = function(sym) {
		me.ul.html('');
		for (i = 0; i < sym.length; i++) {
			me.squares.push(new Square(i, sym[i], me));
		}
		me.set_start_position();
	};

	me.set_start_position = function() {
		me.start = me.squares[0];
		me.scanned_square = me.start;
		me.scanned_square.li.addClass('selected');
		me.actualIndex = 0;
	};

	me.set_symbols(symbols);

	me.right = function() {
		me.actualIndex++;
		if (me.squares[(me.actualIndex + 9)] == null) {
			me.squares.push(new Square((me.actualIndex + 9), '#', me));
		}
		me.scanned_square.li.removeClass('selected');
		me.scanned_square = me.squares[me.actualIndex];
		me.scanned_square.li.addClass('selected');
		return true;
	};

	me.left = function() {
		if (me.actualIndex > 0) {
			me.actualIndex--;
			me.scanned_square.li.removeClass('selected');
			me.scanned_square = me.squares[me.actualIndex];
			me.scanned_square.li.addClass('selected');
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

	if (symbol == "#") {
		me.li = $('<li></li>');
	} else {
		me.li = $('<li>' + me.symbol + '</li>');
	}
	me.tape.ul.append(me.li);

	me.write = function(symbol) {
		me.symbol = symbol;
		if (symbol == '#') {
			me.li.html('');
		} else {
			me.li.html(me.symbol);
		}
	};

};

var ConfigurationTable = function(confs, tbl, skeleton) {

	var me = this;

	me.configurations = [];
	me.skeleton = skeleton;
	me.functions = [];
	if (me.skeleton != null) {
		me.functions = me.skeleton.configurations;
	}

	if (tbl == null) {
		me.table = $("#configurations");
	} else {
		me.table = $("#" + tbl);
	}

	if (confs != null) {
		for (i in confs) {
			me.configurations.push(new m_configuration(me, confs[i]));
		}
	} else {
		me.configurations.push(new m_configuration(me, [ 'q1',
				[ [ '', 'x,L,R', 'q2' ] ] ]));
	}

	me.get = function(gm_conf) {
		var vars = [];
		var fm = gm_conf.final_m_conf;
		if (gm_conf.final_m_conf instanceof Array) {
			fm = gm_conf.final_m_conf[0];
			vars = gm_conf.final_m_conf[1];
			// alert(gm_conf.symbol+''+vars);
		}
		for (c in me.configurations) {
			if (me.configurations[c].m_conf == fm) {
				return me.configurations[c];
			}
		}
		if (vars.length > 0) {
			var dict = {};
			// alert(me.functions);
			for (f in me.functions) {
				var func = me.functions[f];
				if (func.m_conf == fm && func.params.length == vars.length) {
					// alert(func.m_conf+' '+fm+' '+vars.length);
					for (v in func.params) {
						if (func.params[v] == '[]') {
							dict['[]'] = gm_conf.stored_symbol;
						} else {
							dict[func.params[v]] = vars[v];
						}
					}
					var p_func = [ func.m_conf, [] ];
					for (ff in func.operations) {
						var p_op = [];
						var op = func.operations[ff];
						var opstr = '';
						if (op.operation != null) {
							for (o in op.operation) {
								if (opstr != '') {
									opstr += ',';
								}
								opstr += me.symbol_replace(op.operation[o],
										dict);
							}
						}
						var fff = [ me.symbol_replace(op.symbol, dict), opstr,
								me.var_replace(op.final_m_conf, dict) ];
						if (p_func[0] == 'f2') {
							// alert(fff[2]);
						}
						// alert([me.symbol_replace(op.symbol,
						// dict),opstr,me.var_replace(op.final_m_conf, dict)]);
						p_func[1].push(fff);
					}
					return new m_configuration(null, p_func);
				}
			}
		}
		return null;
	};

	me.symbol_replace = function(symbol, dict) {
		if (symbol.substr(0, 1) == '~') {
			// alert(typeof symbol);
			var spl = symbol.substring(1, symbol.length).split(',');
			if (spl.length > 1) {
				var str = '~';
				for (ss in spl) {
					if (str != '~') {
						str += ',';
					}
					str += me.symbol_replace(spl[ss], dict);
				}
				return str;
			} else {
				return '~' + me.symbol_replace(spl[0], dict);
			}
		} else {
			if (dict[symbol] != null) {
				return dict[symbol];
			}
			return symbol;
		}
	};

	me.var_replace = function(f, dict) {
		var varsr = [];
		// alert(f);
		if (f instanceof Array) {
			for (i in f[1]) {
				if (f[1][i] instanceof Array) {
					varsr.push(var_replace(f[1][i]), dict);
				} else {
					if (dict[f[1][i]] != null) {
						varsr.push(dict[f[1][i]]);
					} else {
						varsr.push(f[1][i]);
					}
				}
			}
			return [ f[0], varsr ];
		} else {
			if(dict[f]!=null){
				return dict[f];
			} else {
				return f;
			}
		}
	};

	me.get_operation_var = function(op) {
		switch (op) {
		case 'E':
			return 'S0';
		case '0':
			return 'S1';
		case '1':
			return 'S2';
		case '@':
			return 'S3';
		case 'x':
			return 'S4';
		}
	};

	me.compile = function() {
		var compiledTable = [];
		q = 1;

		var dict = {};
		var last_state = null;
		var last_configuration = null;

		for (c = 0; c < me.configurations.length; c++) {
			var conf = me.configurations[c];
			dict[conf.m_conf] = 'q' + q;

			for (i = 0; i < conf.operations.length; i++) {
				var operation = conf.operations[i];
				var ops = operation.operation;
				var symbol = operation.symbol;

				if (ops == null
						|| ops.length == 1
						|| ((ops.length == 2) && ((ops[0] != 'R' && ops[0] != 'L') && (ops[1] == 'R' || ops[2] == 'L')))) {
					var opstr = '';
					if (ops != null) {
						if (ops.length == 1) {
							if (ops[0] != 'R' && ops[0] != 'L') {
								opstr = me.get_operation_var(ops[0]);
							} else {
								opstr = ops[0];
							}
						} else if (ops.length == 2) {
							opstr = me.get_operation_var(ops[0]) + ',' + ops[1];
						}
					}
					// if(i==(conf.operations.length-1)){
					compiledTable.push([ 'q' + q,
							[ [ symbol, opstr, operation.final_m_conf ] ] ]);
					// } else {
					// compiledTable.push(['q'+q,[[symbol,opstr,'q'+(q+1)]]]);
					// }
					last_state = 'q' + q;
					q++;
				} else {
					var o = 0;
					while (o < ops.length) {
						var opstr = '';
						if (ops[o] == 'R' || ops[o] == 'L') {
							opstr = ops[o];
							var final_m = 'q' + (q + 1);
							o++;
							if (o == ops.length) {
								final_m = operation.final_m_conf;
							}
							compiledTable.push([ 'q' + q,
									[ [ symbol, opstr, final_m ] ] ]);
							symbol = '';
							q++;
						} else {
							opstr = me.get_operation_var(ops[o]);
							o++;
							if (ops[o] == 'R' || ops[o] == 'L') {
								opstr += ',' + ops[o];
								o++;
							}
							var final_m = 'q' + (q + 1);
							if (q == 17) {
								alert(o + ' ' + ops.length);
							}
							if (o == ops.length) {
								final_m = operation.final_m_conf;
							}
							compiledTable.push([ 'q' + q,
									[ [ symbol, opstr, final_m ] ] ]);
							symbol = '';
							q++;
						}
					}
				}
			}
		}

		for (j in compiledTable) {
			var f_m = compiledTable[j][1][0][2];
			if (dict[f_m] != null) {
				compiledTable[j][1][0][2] = dict[f_m];
			}
		}

		me.compiledTable = compiledTable;
		return compiledTable;
	};

	me.get_var_string = function(v) {
		if (v == 'R' || v == 'L') {
			return v;
		} else if (v == '') {
			return 'N';
		} else {
			var v_str = 'D';
			var v_str_nm = parseInt(v.substring(1, v.length));
			for (j = 0; j < v_str_nm; j++) {
				v_str += 'C';
			}
			return v_str;
		}
	};

	me.compiled_string = function(table, full) {
		var tbl = table;
		var str = '';
		if (table == null) {
			if (me.compiledTable == null) {
				tbl = me.compile();
			}
			tbl = me.compiledTable;
		}
		for (c in tbl) {
			var conf = tbl[c];
			var m_nm = parseInt(conf[0].substring(1, conf[0].length));
			str += 'D';
			for (i = 0; i < m_nm; i++) {
				str += 'A';
			}
			var ins = conf[1][0];
			str += me.get_var_string(ins[0]);
			var ops = ins[1].split(',');
			for (o in ops) {
				str += me.get_var_string(ops[o]);
			}
			var fm_nm = parseInt(ins[2].substring(1, ins[2].length));
			str += 'D';
			for (i = 0; i < fm_nm; i++) {
				str += 'A';
			}
			str += ';';
		}
		me.compiled_string = str;
		if (full != null && full) {
			var ar = str.split('');
			var fulls = [ '@', '@' ,';','#'];
			for (i in ar) {
				fulls.push(ar[i]);
				fulls.push('#');
			}
			me.full_compiled_string = fulls;
			return fulls;
		}
		return str;

	};

	me.add = function() {
		me.configurations.push(new Configuration(me));
	};
};

function mf_str(f) {
	if (f instanceof Array) {
		var str = '';
		for (i in f[1]) {
			if (str != '') {
				str += ',';
			}
			str += mf_str(f[1][i]);
		}
		return f[0] + '(' + str + ')';
	}
	return f;
}

// alert(mf_str(['f',[['z',['D','x']],'D','x']]));

var m_configuration = function(table, conf) {

	var me = this;
	me.table = table;
	me.m_conf = conf[0];
	me.params = [];
	me.groups = conf[1];
	if (conf.length == 3) {
		// alert('z');
		me.params = conf[1];
		me.groups = conf[2]
	}

	me.operations = [];
	me.td_m_conf = null;

	for (i in me.groups) {
		var g = me.groups[i];
		var opr = null;
		if (g != null && g[1] != null && g[1] != '') {
			opr = g[1].split(',');
		}

		var op = {
			'tr' : $('<tr></tr>'),
			'td_symbol' : $('<td class="c-symbol">' + g[0] + '</td>'),
			'td_operation' : $('<td class="c-operation">' + g[1] + '</td>'),
			'td_final_m_conf' : $('<td class="c-final_m_conf">' + mf_str(g[2])
					+ '</td>'),
			'symbol' : g[0],
			'operation' : opr,
			'final_m_conf' : g[2],
			'stored_symbol' : null
		};
		me.operations.push(op);
		var prm = '';
		if (me.params.length > 0) {
			for (j in me.params) {
				if (prm != '') {
					prm += ',';
				}
				prm += me.params[j];
			}
			prm = '(' + prm + ')';
		}

		if (me.td_m_conf == null) {
			me.td_m_conf = $('<td class="c-m_conf" rowspan="'
					+ me.groups.length + '">' + me.m_conf + prm + '</td>');
			op["tr"].append(me.td_m_conf);
		}
		op["tr"].append(op["td_symbol"]);
		op["tr"].append(op["td_operation"]);
		op["tr"].append(op["td_final_m_conf"]);
		if (me.table != null) {
			me.table.table.append(op["tr"]);
		}
	}

	me.stored_symbol = null;

	me.get_operation = function(scanned_symbol) {
		for (i in me.operations) {
			var op = me.operations[i];
			if (op.symbol == null || op.symbol == '') {
				return op;
			} else if (op.symbol == '#' && scanned_symbol == '#') {
				return op;
			} else if (op.symbol == '[]') {
				op.stored_symbol = scanned_symbol;
				return op;
			} else if (op.symbol == '*' && scanned_symbol != '#') {
				return op;
			} else {
				if (op.symbol == scanned_symbol) {
					return op;
				} else if (op.symbol.substr(0, 1) == '~') {
					// alert('z');
					var str = op.symbol.substr(1, op.symbol.length);
					var spl = str.split(',');
					if (spl.length > 1) {
						for (s in spl) {
							if (spl[s] == scanned_symbol) {
								return null;
							}
						}
						return op;
					} else {
						if (scanned_symbol != spl[0]) {
							return op;
						}
					}
				}
			}
		}
		return null;
	};
};

var TuringMachine = function(tables, skeleton, start) {
	var me = this;
	me.tables = tables;
	me.reg = new Registrer(tables[0], start, skeleton);
	me.start = function() {
		me.reg.start();
	}
};
