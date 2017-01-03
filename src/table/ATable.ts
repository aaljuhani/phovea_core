/**
 * Created by Samuel Gratzl on 27.12.2016.
 */

import {IPersistable} from '../index';
import {Range, all, parse, RangeLike} from '../range';
import {SelectAble, resolve as idtypes_resolve, IDType} from '../idtype';
import {IVector} from '../vector';
import {ITable, IQueryArgs} from './ITable';
import MultiTableVector from './internal/MultiTableVector';
import {IValueType, IValueTypeDesc} from '../datatype';

/**
 * base class for different Table implementations, views, transposed,...
 */
export abstract class ATable extends SelectAble {
  constructor(protected root: ITable) {
    super();
  }

  get dim() {
    return this.size();
  }

  get nrow() {
    return this.dim[0];
  }

  get ncol() {
    return this.dim[1];
  }

  abstract size(): number[];

  view(range: RangeLike = all()): ITable {
    return new TableView(this.root, parse(range));
  }

  abstract colData(column: string, range?: RangeLike);

  abstract queryView(name: string, args: IQueryArgs): ITable;

  idView(idRange: RangeLike = all()): Promise<ITable> {
    return this.ids().then((ids) => this.view(ids.indexOf(parse(idRange))));
  }

  reduce<T, D extends IValueTypeDesc>(f: (row: IValueType[]) => T, this_f?: any, valuetype?: D, idtype?: IDType): IVector<T,D> {
    return new MultiTableVector(this.root, f, this_f, valuetype, idtype);
  }

  restore(persisted: any): IPersistable {
    if (persisted && persisted.f) {
      /* tslint:disable:no-eval */
      return this.reduce(eval(persisted.f), this, persisted.valuetype, persisted.idtype ? idtypes_resolve(persisted.idtype) : undefined);
      /* tslint:enable:no-eval */
    } else if (persisted && persisted.range) { //some view onto it
      return this.view(parse(persisted.range));
    } else {
      return <IPersistable>(<any>this);
    }
  }
}

export default ATable;

// circular dependency thus not extractable
/**
 * view on the vector restricted by a range
 * @param root underlying matrix
 * @param range range selection
 * @param t optional its transposed version
 * @constructor
 */
export class TableView extends ATable implements ITable {
  constructor(root: ITable, private range: Range) {
    super(root);
    this.range = range;
  }

  get desc() {
    return this.root.desc;
  }

  persist() {
    return {
      root: this.root.persist(),
      range: this.range.toString()
    };
  }

  restore(persisted: any) {
    let r: ITable = this;
    if (persisted && persisted.range) { //some view onto it
      r = r.view(parse(persisted.range));
    }
    return r;
  }

  size() {
    return this.range.size(this.root.dim);
  }

  at(i: number, j: number) {
    let inverted = this.range.invert([i, j], this.root.dim);
    return this.root.at(inverted[0], inverted[1]);
  }

  col(i: number) {
    let inverted = this.range.invert([0, i], this.root.dim);
    return this.root.col(inverted[1]);
  }

  cols(range: RangeLike = all()) {
    return this.root.cols(this.range.swap().preMultiply(parse(range), this.root.dim));
  }

  data(range: RangeLike = all()) {
    return this.root.data(this.range.preMultiply(parse(range), this.root.dim));
  }

  colData(column: string, range: RangeLike = all()) {
    return this.root.colData(column, this.range.preMultiply(parse(range), this.root.dim));
  }

  objects(range: RangeLike = all()) {
    return this.root.objects(this.range.preMultiply(parse(range), this.root.dim));
  }

  rows(range: RangeLike = all()) {
    return this.root.rows(this.range.preMultiply(parse(range), this.root.dim));
  }

  rowIds(range: RangeLike = all()) {
    return this.root.rowIds(this.range.preMultiply(parse(range), this.root.dim));
  }

  ids(range: RangeLike = all()) {
    return this.rowIds(range);
  }

  view(range: RangeLike = all()) {
    const r = parse(range);
    if (r.isAll) {
      return this;
    }
    return new TableView(this.root, this.range.preMultiply(r, this.dim));
  }

  get idtype() {
    return this.root.idtype;
  }

  get idtypes() {
    return [this.idtype];
  }

  queryView(name: string, args: any): ITable {
    throw new Error('not implemented');
  }
}
