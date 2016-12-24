/* *****************************************************************************
 * Caleydo - Visualization for Molecular Biology - http://caleydo.org
 * Copyright (c) The Caleydo Team. All rights reserved.
 * Licensed under the new BSD license, available at http://caleydo.org/license
 **************************************************************************** */
/**
 * Created by Samuel Gratzl on 04.08.2014.
 */

import {Range, RangeLike} from './range';
import {IProductSelectAble, IDType} from './idtype';
import {IDataType, IValueTypeDesc, IValueType, IDataDescription} from './datatype';
import {IVector} from './vector';
import {IHistogram, IStatistics} from './math';

export const IDTYPE_ROW = 0;
export const IDTYPE_COLUMN = 1;
export const IDTYPE_CELL = 2;

export interface IHeatMapUrlOptions {
  format?: string;
  transpose?: boolean;
  range?: [number, number];
  palette?: string;
}

export interface IMatrixDataDescription extends IDataDescription {
  loadAtOnce?: boolean;
  value: IValueTypeDesc;
  rowtype: string;
  coltype: string;
  size: [number, number];
}

export interface IMatrix extends IDataType, IProductSelectAble {
  readonly desc: IMatrixDataDescription;
  /**
   * nrow * ncol
   */
  readonly length: number;
  /**
   * number of rows
   */
  readonly nrow: number;
  /**
   * number of cols
   */
  readonly ncol: number;
  /**
   * type of the value - to be specified
   */
  readonly valuetype: IValueTypeDesc;

  /**
   * row id type
   */
  readonly rowtype: IDType;

  /**
   * column id type
   */
  readonly coltype: IDType;

  /**
   * creates a new view on this matrix specified by the given range
   * @param range
   */
  view(range?: RangeLike): IMatrix;

  slice(col: number): IVector;

  //view(filter: string): Promise<IMatrix>;

  /**
   * reduces the current matrix to a vector using the given reduce function
   * @param f the reduce function
   * @param this_f the this context for the function default the matrix
   * @param valuetype the new value type by default the same as matrix valuetype
   * @param idtype the new vlaue type by default the same as matrix rowtype
   */
  reduce(f: (row: IValueType[]) => any, this_f?: any, valuetype?: IValueTypeDesc, idtype?: IDType): IVector;
  /**
   * transposed version of this matrix
   */
  readonly t: IMatrix;
  /**
   * returns a promise for getting the col names of the matrix
   * @param range
   * @returns {IPromise<string[]>}
   */
  cols(range?: RangeLike): Promise<string[]>;

  colIds(range?: RangeLike): Promise<Range>;
  /**
   * returns a promise for getting the row names of the matrix
   * @param range
   */
  rows(range?: RangeLike): Promise<string[]>;

  rowIds(range?: RangeLike): Promise<Range>;

  /**
   * returns a promise for getting one cell
   * @param i
   * @param j
   */
  at(i: number, j: number): Promise<IValueType>;
  /**
   * returns a promise for getting the data as two dimensional array
   * @param range
   */
  data(range?: RangeLike): Promise<IValueType[][]>;

  stats(): Promise<IStatistics>;

  hist(bins?: number, range?: RangeLike, containedIds?: number): Promise<IHistogram>;

  /**
   * generates a server url for creating a heatmap image of this matrix
   * @param range
   * @param options
   * @returns the url or null if no url can be generated
   */
  heatmapUrl(range?: RangeLike, options?: IHeatMapUrlOptions): string;
}

export default IMatrix;
