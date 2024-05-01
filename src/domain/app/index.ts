export interface IAppState {
  isCollapseSidebar: boolean
}

export interface IRouter {
  path: string
  name: string
  children?: IRouter[]
  icon?: React.FC<any> | React.FunctionComponent<any>
  role?: string[]
}
