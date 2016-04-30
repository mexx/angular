import { isBlank } from 'angular2/src/facade/lang';
import { BaseException } from 'angular2/src/facade/exceptions';
import * as o from '../output/output_ast';
import { Identifiers, identifierToken } from '../identifiers';
import { injectFromViewParentInjector, createPureProxy, getPropertyInView } from './util';
class _PurePipeProxy {
    constructor(instance, argCount) {
        this.instance = instance;
        this.argCount = argCount;
    }
}
export class CompilePipe {
    constructor(view, name) {
        this.view = view;
        this._purePipeProxies = [];
        this.meta = _findPipeMeta(view, name);
        this.instance = o.THIS_EXPR.prop(`_pipe_${name}_${view.pipeCount++}`);
    }
    get pure() { return this.meta.pure; }
    create() {
        var deps = this.meta.type.diDeps.map((diDep) => {
            if (diDep.token.equalsTo(identifierToken(Identifiers.ChangeDetectorRef))) {
                return getPropertyInView(o.THIS_EXPR.prop('ref'), this.view, this.view.componentView);
            }
            return injectFromViewParentInjector(diDep.token, false);
        });
        this.view.fields.push(new o.ClassField(this.instance.name, o.importType(this.meta.type), [o.StmtModifier.Private]));
        this.view.createMethod.resetDebugInfo(null, null);
        this.view.createMethod.addStmt(o.THIS_EXPR.prop(this.instance.name)
            .set(o.importExpr(this.meta.type).instantiate(deps))
            .toStmt());
        this._purePipeProxies.forEach((purePipeProxy) => {
            createPureProxy(this.instance.prop('transform').callMethod(o.BuiltinMethod.bind, [this.instance]), purePipeProxy.argCount, purePipeProxy.instance, this.view);
        });
    }
    call(callingView, args) {
        if (this.meta.pure) {
            var purePipeProxy = new _PurePipeProxy(o.THIS_EXPR.prop(`${this.instance.name}_${this._purePipeProxies.length}`), args.length);
            this._purePipeProxies.push(purePipeProxy);
            return getPropertyInView(o.importExpr(Identifiers.castByValue)
                .callFn([purePipeProxy.instance, this.instance.prop('transform')]), callingView, this.view)
                .callFn(args);
        }
        else {
            return getPropertyInView(this.instance, callingView, this.view).callMethod('transform', args);
        }
    }
}
function _findPipeMeta(view, name) {
    var pipeMeta = null;
    for (var i = view.pipeMetas.length - 1; i >= 0; i--) {
        var localPipeMeta = view.pipeMetas[i];
        if (localPipeMeta.name == name) {
            pipeMeta = localPipeMeta;
            break;
        }
    }
    if (isBlank(pipeMeta)) {
        throw new BaseException(`Illegal state: Could not find pipe ${name} although the parser should have detected this error!`);
    }
    return pipeMeta;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGlsZV9waXBlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGlmZmluZ19wbHVnaW5fd3JhcHBlci1vdXRwdXRfcGF0aC1OeVRHZEZjQi50bXAvYW5ndWxhcjIvc3JjL2NvbXBpbGVyL3ZpZXdfY29tcGlsZXIvY29tcGlsZV9waXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJPQUFPLEVBQUMsT0FBTyxFQUFZLE1BQU0sMEJBQTBCO09BQ3BELEVBQUMsYUFBYSxFQUFDLE1BQU0sZ0NBQWdDO09BQ3JELEtBQUssQ0FBQyxNQUFNLHNCQUFzQjtPQUdsQyxFQUFDLFdBQVcsRUFBRSxlQUFlLEVBQUMsTUFBTSxnQkFBZ0I7T0FDcEQsRUFBQyw0QkFBNEIsRUFBRSxlQUFlLEVBQUUsaUJBQWlCLEVBQUMsTUFBTSxRQUFRO0FBRXZGO0lBQ0UsWUFBbUIsUUFBd0IsRUFBUyxRQUFnQjtRQUFqRCxhQUFRLEdBQVIsUUFBUSxDQUFnQjtRQUFTLGFBQVEsR0FBUixRQUFRLENBQVE7SUFBRyxDQUFDO0FBQzFFLENBQUM7QUFFRDtJQUtFLFlBQW1CLElBQWlCLEVBQUUsSUFBWTtRQUEvQixTQUFJLEdBQUosSUFBSSxDQUFhO1FBRjVCLHFCQUFnQixHQUFxQixFQUFFLENBQUM7UUFHOUMsSUFBSSxDQUFDLElBQUksR0FBRyxhQUFhLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3RDLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsU0FBUyxJQUFJLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUN4RSxDQUFDO0lBRUQsSUFBSSxJQUFJLEtBQWMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUU5QyxNQUFNO1FBQ0osSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcs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QUUsSUFBSSxDQUFDLENBQUM7UUFDaEcsQ0FBQztJQUNILENBQUM7QUFDSCxDQUFDO0FBR0QsdUJBQXVCLElBQWlCLEVBQUUsSUFBWTtJQUNwRCxJQUFJLFFBQVEsR0FBd0IsSUFBSSxDQUFDO0lBQ3pDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7UUFDcEQsSUFBSSxhQUFhLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QyxFQUFFLENBQUMsQ0FBQyxhQUFhLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDL0IsUUFBUSxHQUFHLGFBQWEsQ0FBQztZQUN6QixLQUFLLENBQUM7UUFDUixDQUFDO0lBQ0gsQ0FBQztJQUNELEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEIsTUFBTSxJQUFJLGFBQWEsQ0FDbkIsc0NBQXNDLElBQUksdURBQXVELENBQUMsQ0FBQztJQUN6RyxDQUFDO0lBQ0QsTUFBTSxDQUFDLFFBQVEsQ0FBQztBQUNsQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtpc0JsYW5rLCBpc1ByZXNlbnR9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvbGFuZyc7XG5pbXBvcnQge0Jhc2VFeGNlcHRpb259IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvZXhjZXB0aW9ucyc7XG5pbXBvcnQgKiBhcyBvIGZyb20gJy4uL291dHB1dC9vdXRwdXRfYXN0JztcbmltcG9ydCB7Q29tcGlsZVZpZXd9IGZyb20gJy4vY29tcGlsZV92aWV3JztcbmltcG9ydCB7Q29tcGlsZVBpcGVNZXRhZGF0YX0gZnJvbSAnLi4vY29tcGlsZV9tZXRhZGF0YSc7XG5pbXBvcnQge0lkZW50aWZpZXJzLCBpZGVudGlmaWVyVG9rZW59IGZyb20gJy4uL2lkZW50aWZpZXJzJztcbmltcG9ydCB7aW5qZWN0RnJvbVZpZXdQYXJlbnRJbmplY3RvciwgY3JlYXRlUHVyZVByb3h5LCBnZXRQcm9wZXJ0eUluVmlld30gZnJvbSAnLi91dGlsJztcblxuY2xhc3MgX1B1cmVQaXBlUHJveHkge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgaW5zdGFuY2U6IG8uUmVhZFByb3BFeHByLCBwdWJsaWMgYXJnQ291bnQ6IG51bWJlcikge31cbn1cblxuZXhwb3J0IGNsYXNzIENvbXBpbGVQaXBlIHtcbiAgbWV0YTogQ29tcGlsZVBpcGVNZXRhZGF0YTtcbiAgaW5zdGFuY2U6IG8uUmVhZFByb3BFeHByO1xuICBwcml2YXRlIF9wdXJlUGlwZVByb3hpZXM6IF9QdXJlUGlwZVByb3h5W10gPSBbXTtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgdmlldzogQ29tcGlsZVZpZXcsIG5hbWU6IHN0cmluZykge1xuICAgIHRoaXMubWV0YSA9IF9maW5kUGlwZU1ldGEodmlldywgbmFtZSk7XG4gICAgdGhpcy5pbnN0YW5jZSA9IG8uVEhJU19FWFBSLnByb3AoYF9waXBlXyR7bmFtZX1fJHt2aWV3LnBpcGVDb3VudCsrfWApO1xuICB9XG5cbiAgZ2V0IHB1cmUoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLm1ldGEucHVyZTsgfVxuXG4gIGNyZWF0ZSgpOiB2b2lkIHtcbiAgICB2YXIgZGVwcyA9IHRoaXMubWV0YS50eXBlLmRpRGVwcy5tYXAoKGRpRGVwKSA9PiB7XG4gICAgICBpZiAoZGlEZXAudG9rZW4uZXF1YWxzVG8oaWRlbnRpZmllclRva2VuKElkZW50aWZpZXJzLkNoYW5nZURldGVjdG9yUmVmKSkpIHtcbiAgICAgICAgcmV0dXJuIGdldFByb3BlcnR5SW5WaWV3KG8uVEhJU19FWFBSLnByb3AoJ3JlZicpLCB0aGlzLnZpZXcsIHRoaXMudmlldy5jb21wb25lbnRWaWV3KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBpbmplY3RGcm9tVmlld1BhcmVudEluamVjdG9yKGRpRGVwLnRva2VuLCBmYWxzZSk7XG4gICAgfSk7XG4gICAgdGhpcy52aWV3LmZpZWxkcy5wdXNoKG5ldyBvLkNsYXNzRmllbGQodGhpcy5pbnN0YW5jZS5uYW1lLCBvLmltcG9ydFR5cGUodGhpcy5tZXRhLnR5cGUpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtvLlN0bXRNb2RpZmllci5Qcml2YXRlXSkpO1xuICAgIHRoaXMudmlldy5jcmVhdGVNZXRob2QucmVzZXREZWJ1Z0luZm8obnVsbCwgbnVsbCk7XG4gICAgdGhpcy52aWV3LmNyZWF0ZU1ldGhvZC5hZGRTdG10KG8uVEhJU19FWFBSLnByb3AodGhpcy5pbnN0YW5jZS5uYW1lKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnNldChvLmltcG9ydEV4cHIodGhpcy5tZXRhLnR5cGUpLmluc3RhbnRpYXRlKGRlcHMpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRvU3RtdCgpKTtcbiAgICB0aGlzLl9wdXJlUGlwZVByb3hpZXMuZm9yRWFjaCgocHVyZVBpcGVQcm94eSkgPT4ge1xuICAgICAgY3JlYXRlUHVyZVByb3h5KFxuICAgICAgICAgIHRoaXMuaW5zdGFuY2UucHJvcCgndHJhbnNmb3JtJykuY2FsbE1ldGhvZChvLkJ1aWx0aW5NZXRob2QuYmluZCwgW3RoaXMuaW5zdGFuY2VdKSxcbiAgICAgICAgICBwdXJlUGlwZVByb3h5LmFyZ0NvdW50LCBwdXJlUGlwZVByb3h5Lmluc3RhbmNlLCB0aGlzLnZpZXcpO1xuICAgIH0pO1xuICB9XG5cbiAgY2FsbChjYWxsaW5nVmlldzogQ29tcGlsZVZpZXcsIGFyZ3M6IG8uRXhwcmVzc2lvbltdKTogby5FeHByZXNzaW9uIHtcbiAgICBpZiAodGhpcy5tZXRhLnB1cmUpIHtcbiAgICAgIHZhciBwdXJlUGlwZVByb3h5ID0gbmV3IF9QdXJlUGlwZVByb3h5KFxuICAgICAgICAgIG8uVEhJU19FWFBSLnByb3AoYCR7dGhpcy5pbnN0YW5jZS5uYW1lfV8ke3RoaXMuX3B1cmVQaXBlUHJveGllcy5sZW5ndGh9YCksIGFyZ3MubGVuZ3RoKTtcbiAgICAgIHRoaXMuX3B1cmVQaXBlUHJveGllcy5wdXNoKHB1cmVQaXBlUHJveHkpO1xuICAgICAgcmV0dXJuIGdldFByb3BlcnR5SW5WaWV3KFxuICAgICAgICAgICAgICAgICBvLmltcG9ydEV4cHIoSWRlbnRpZmllcnMuY2FzdEJ5VmFsdWUpXG4gICAgICAgICAgICAgICAgICAgICAuY2FsbEZuKFtwdXJlUGlwZVByb3h5Lmluc3RhbmNlLCB0aGlzLmluc3RhbmNlLnByb3AoJ3RyYW5zZm9ybScpXSksXG4gICAgICAgICAgICAgICAgIGNhbGxpbmdWaWV3LCB0aGlzLnZpZXcpXG4gICAgICAgICAgLmNhbGxGbihhcmdzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGdldFByb3BlcnR5SW5WaWV3KHRoaXMuaW5zdGFuY2UsIGNhbGxpbmdWaWV3LCB0aGlzLnZpZXcpLmNhbGxNZXRob2QoJ3RyYW5zZm9ybScsIGFyZ3MpO1xuICAgIH1cbiAgfVxufVxuXG5cbmZ1bmN0aW9uIF9maW5kUGlwZU1ldGEodmlldzogQ29tcGlsZVZpZXcsIG5hbWU6IHN0cmluZyk6IENvbXBpbGVQaXBlTWV0YWRhdGEge1xuICB2YXIgcGlwZU1ldGE6IENvbXBpbGVQaXBlTWV0YWRhdGEgPSBudWxsO1xuICBmb3IgKHZhciBpID0gdmlldy5waXBlTWV0YXMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICB2YXIgbG9jYWxQaXBlTWV0YSA9IHZpZXcucGlwZU1ldGFzW2ldO1xuICAgIGlmIChsb2NhbFBpcGVNZXRhLm5hbWUgPT0gbmFtZSkge1xuICAgICAgcGlwZU1ldGEgPSBsb2NhbFBpcGVNZXRhO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIGlmIChpc0JsYW5rKHBpcGVNZXRhKSkge1xuICAgIHRocm93IG5ldyBCYXNlRXhjZXB0aW9uKFxuICAgICAgICBgSWxsZWdhbCBzdGF0ZTogQ291bGQgbm90IGZpbmQgcGlwZSAke25hbWV9IGFsdGhvdWdoIHRoZSBwYXJzZXIgc2hvdWxkIGhhdmUgZGV0ZWN0ZWQgdGhpcyBlcnJvciFgKTtcbiAgfVxuICByZXR1cm4gcGlwZU1ldGE7XG59XG4iXX0=